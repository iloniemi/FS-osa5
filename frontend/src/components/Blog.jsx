import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, addLike, user, removeBlog }) => {
  const [showAll, setShowAll] = useState(false)

  const toggleShowAll = () => setShowAll(!showAll)

  const thisUsersBlog = blog.user.username === user?.username


  const extraInfo = () => (
    <>
      <div data-testid={`blog-url-${blog.id}`} >{blog.url}</div>
      <div data-testid={`blog-likes-${blog.id}`} >
        {`likes ${blog.likes}`}
        <button onClick={handleLike} data-testid={`blog-like-button-${blog.id}`}>
          like
        </button></div>
      <div>{blog.user.name}</div>
      { thisUsersBlog && <div><button onClick={handleRemove} data-testid={`blog-remove-button-${blog.id}`} >
        remove
      </button></div>}
    </>
  )

  const handleLike = async () => {
    const changedBlog = await addLike(blog)
  }

  const handleRemove = async () => {
    await removeBlog(blog)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={ blogStyle }>
      <div>
        { blog.title} {blog.author }
        <button onClick={ toggleShowAll } data-testid={`blog-info-toggle-button-${blog.id}`} >
          { showAll ? 'hide' : 'view' }
        </button>
      </div>
      { showAll && extraInfo() }
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired
}

export default Blog