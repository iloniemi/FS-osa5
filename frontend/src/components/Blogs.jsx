import Blog from './Blog'
import PropTypes from 'prop-types'

const Blogs = ({ blogs, addLike, user, removeBlog }) => {
  const blogsByLikes = (firstBlog, secondBlog) => secondBlog.likes - firstBlog.likes

  return <div>
    {blogs.sort(blogsByLikes).map(blog => <Blog key={blog.id} blog={blog} addLike={addLike} user={user} removeBlog={removeBlog} /> )}
  </div>
}

Blogs.propTypes = {
  blogs: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired
}

export default Blogs