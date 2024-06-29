import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const createConfig = () => ({ headers: { Authorization: token } })

const setToken = newToken => token = `Bearer ${newToken}`
const removeToken = () => token = null

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async changedBlog => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.put(`${baseUrl}/${changedBlog.id}`, changedBlog, config)
  return response.data
}

const remove = async id => {
  await axios.delete(`${baseUrl}/${id}`, createConfig())
}

export default { getAll, create, setToken, removeToken, update, remove }