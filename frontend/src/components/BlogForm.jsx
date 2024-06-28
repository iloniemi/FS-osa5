import { useState } from "react"


const InputRow = ({name, value, setValue}) => (
  <div>
    {name}
      <input
        type="text"
        value={value}
        name={name}
        onChange={({target}) => setValue(target.value)}
      />      
  </div>
)

const BlogForm = ({handleCreateBlog}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  

  const handleNewBlog = (event) => {
    event.preventDefault()
    console.log('create new blog')
    handleCreateBlog(title, author, url)
  }

  return <>
    <h2>create new</h2>
    
    <form onSubmit={handleNewBlog}>
      <InputRow name="Title" value={title} setValue={setTitle}/>
      <InputRow name="Author" value={author} setValue={setAuthor}/>
      <InputRow name="Url" value={url} setValue={setUrl}/>
      <button type="submit">create</button>
    </form>
  </>
}


export default BlogForm