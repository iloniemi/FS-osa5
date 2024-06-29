import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, addLike, user, removeBlog }) => {
  const [showAll, setShowAll] = useState(false)
  const [thisBlog, setThisBlog] = useState(blog)

  const toggleShowAll = () => setShowAll(!showAll)
  
  const thisUsersBlog = thisBlog.user.username === user?.username
  

  const extraInfo = () => (
    <>
      <div>{thisBlog.url}</div>
      <div>{`likes ${thisBlog.likes}`}<button onClick={handleLike}>like</button></div>
      <div>{thisBlog.user.name}</div>
      { thisUsersBlog && <div><button onClick={handleRemove}>remove</button></div>}
    </>
  )

  const handleLike = async () => {
    const changedBlog = await addLike(thisBlog)
    if (changedBlog) setThisBlog(changedBlog)
  }

const handleRemove = async () => {
  await removeBlog(thisBlog)
}

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div>
        {thisBlog.title} {thisBlog.author}
        <button onClick={toggleShowAll}>{showAll ? 'hide' : 'view'}</button>
      </div>
      {showAll && extraInfo()}
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