import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    
    try {
      const user = await loginService.login({
        username,
        password
      })
      console.log(user)
      
      setUser(user)
      setUserName('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout( () => {
        setErrorMessage(null)
      }, 5000)
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

  const blogview = () => {
    return <>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </>
  }


  return (
    <div>
      { errorMessage && <h1>{errorMessage}</h1> }
      {!user && loginForm()}
      {user && blogview()}
    </div>  
  )
}

export default App