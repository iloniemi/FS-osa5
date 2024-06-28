import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Blogs from './components/Blogs.jsx'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()

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

  const handleLogin = async (username, password) => {
    try {
      const loggedUser = await loginService.login({
        username,
        password
      })
      console.log('logged in as ', loggedUser.name)
      
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(loggedUser)
      )
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)

    } catch (exception) {
      showNotification('wrong credentials')
    }
  }

  const handleLogout = () => {
    console.log(`logged out ${user.name}`);
    
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.removeToken()
    setUser(null)
    showNotification('logged out')
  }

  const handleCreateBlog = async (title, author, url) => {
    const newBlog = {title, author, url}
    console.log('sending blog: ', newBlog)

    try {
      const addedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(addedBlog))
      console.log('received blog: ', addedBlog)
      blogFormRef.current.toggleVisibility()
      showNotification(`added new blog, ${addedBlog.title}, by ${addedBlog.author || 'Anonymous'}`)

    } catch (exception) {
      console.log(exception)
      if (exception.response.status === 400) {
        showNotification(exception.response.data.error)
      }
    }

  }

  // When not logged in
  if (!user) return (
    <div>
      { notification && <h1>{notification}</h1> }
      <LoginForm handleLogin={handleLogin} />
    </div>
  )
  // When logged in
  return (
    <div>
      { notification && <h1>{notification}</h1> }
      <h2>blogs</h2>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Blogs blogs={blogs} />
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm handleCreateBlog={handleCreateBlog} />
      </Togglable>
    </div>  
  )
}


export default App