import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const  showNotification = (message) => {
    setNotification(message)
    setTimeout( () => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in as', username, password)
    
    try {
      const user = await loginService.login({
        username,
        password
      })
      console.log(user)
      
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUserName('')
      setPassword('')
    } catch (exception) {
      showNotification('wrong credentials')
    }
  }

  const handleCreateBlog = async (title, author, url) => {
    const newBlog = {title, author, url}
    console.log('sending blog: ', newBlog)

    try {
      const addedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(addedBlog))
      console.log('recieved blog: ', addedBlog)
      showNotification(`added new blog, ${addedBlog.title}, by ${addedBlog.author || 'Anonymous'}`)

    } catch (exception) {
      console.log(exception)
      if (exception.response.status === 400) {
        showNotification(exception.response.data.error)
      }
    }

  }

  const loginForm = () => {
    return <>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({target}) => setUserName(target.value)}
        />
        </div>
        <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({target}) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
      </form>
    </>
  }

  const handleLogout = () => {
    console.log(`logged out ${user.name}`);
    
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.removeToken()
    setUser(null)
    showNotification('logged out')
  }

  const blogview = () => {
    return <>
      <h2>blogs</h2>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </>
  }


  return (
    <div>
      { notification && <h1>{notification}</h1> }
      {!user && loginForm()}
      {user && blogview()}
      {user && <BlogForm handleCreateBlog={handleCreateBlog} />}
    </div>  
  )
}


export default App