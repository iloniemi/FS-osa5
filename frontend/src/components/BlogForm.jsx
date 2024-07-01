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
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return <>
    <h2>create new</h2>

    <form onSubmit={handleNewBlog}>
      <InputRow name='Title' value={title} setValue={setTitle} placeholder={'type in the title'} testid='new-blog-title'/>
      <InputRow name='Author' value={author} setValue={setAuthor} placeholder={'type in the author'} testid='new-blog-author' />
      <InputRow name='Url' value={url} setValue={setUrl} placeholder={'type in the url'} testid='new-blog-url' />
      <button type='submit' data-testid='new-blog-submit-button' >create</button>
    </form>
  </>
}

BlogForm.propTypes = {
  handleCreateBlog: PropTypes.func.isRequired
}

export default BlogForm