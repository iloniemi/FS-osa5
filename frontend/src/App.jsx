import { useState, useEffect, useRef } from 'react'
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

  const blogsByLikes = (firstBlog, secondBlog) => secondBlog.likes - firstBlog.likes

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  // Getting logged in user from localStorage
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
    console.log(`logged out ${user.name}`)

    window.localStorage.removeItem('loggedBlogappUser')
    blogService.removeToken()
    setUser(null)
    showNotification('logged out')
  }

  const handleCreateBlog = async (title, author, url) => {
    const newBlog = { title, author, url }
    console.log('sending blog: ', newBlog)

    try {
      const addedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(addedBlog))
      console.log('received blog: ', addedBlog)
      blogFormRef.current.toggleVisibility()
      showNotification(`${addedBlog.title} by ${addedBlog.author || 'Anonymous'} added`)

    } catch (exception) {
      if (exception.response.status === 400) {
        showNotification(exception.response.data.error)
      }
    }
  }


  const addLike = async blog => {
    console.log('adding a like to blog: ', blog)

    const blogToSend = {
      id: blog.id,
      user: blog.user.id, // User as user ID to server
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    try {
      const receivedBlog = await blogService.update(blogToSend)
      const blogToSet = {
        ...receivedBlog,
        user: blog.user // Setting back the full user info
      }

      // Updating blogs
      setBlogs(
        blogs
          .filter(b => b.id !== blogToSet.id)
          .concat(blogToSet)
          .sort(blogsByLikes))

      showNotification(`${blogToSet.title} now has ${blogToSet.likes} likes`)

    } catch (exception) {
      // Could show error messages
      showNotification('something went wrong')
      if (exception.response.status === 400) {
        showNotification(exception.response.data.error)
      }
    }
  }

  const removeBlog = async blogToRemove => {
    if (!window.confirm(`Remove ${blogToRemove.title} by ${blogToRemove.author || 'Anonymous'}`)) {
      return
    }
    console.log('removing', blogToRemove)
    try {
      await blogService.remove(blogToRemove.id)
      setBlogs(blogs.filter(blog => blog.id !== blogToRemove.id))
    } catch (exception) {
      showNotification(exception.response.data.error)
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
        <button onClick={handleLogout} data-testid='logout-button' >logout</button>
      </p>
      <Blogs blogs={blogs} addLike={addLike} user={user} removeBlog={removeBlog} />
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm handleCreateBlog={handleCreateBlog} />
      </Togglable>
    </div>
  )
}


export default App