import { useState } from "react"

const Blog = ({ blog }) => {
  const [showAll, setShowAll] = useState(false)

  const toggleShowAll = () => setShowAll(!showAll)

  const extraInfo = () => (
    <>
      <div>{blog.url}</div>
      <div>{`likes ${blog.likes}`}<button>like</button></div>
      <div>{blog.user.name}</div>
    </>
  )

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
        {blog.title} {blog.author}
        <button onClick={toggleShowAll}>{showAll ? 'hide' : 'view'}</button>
      </div>
      {showAll && extraInfo()}
    </div>
  )
}

export default Blog