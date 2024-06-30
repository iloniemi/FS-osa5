import { useState } from 'react'
import InputRow from './InputRow'
import PropTypes from 'prop-types'

const BlogForm = ({ handleCreateBlog }) => {
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
      <InputRow name="Title" value={title} setValue={setTitle} placeholder={'type in the title'}/>
      <InputRow name="Author" value={author} setValue={setAuthor} placeholder={'type in the author'}/>
      <InputRow name="Url" value={url} setValue={setUrl} placeholder={'type in the url'}/>
      <button type="submit">create</button>
    </form>
  </>
}

BlogForm.propTypes = {
  handleCreateBlog: PropTypes.func.isRequired
}

export default BlogForm