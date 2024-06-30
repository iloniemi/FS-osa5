import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


describe('Blog', () => {

  const testBlog = {
    id: 'asdoifoashdfpuihasuiehfuiahsfha89f9',
    author: 'Hessu H.',
    title: 'Today I learned',
    url: 'ankka.net/blogs/21',
    likes: 4,
    user: {
      username: 'hesu',
      name: 'Hessu',
      id: 'oihEHFANEIFHIAHFIHUIASHFHA',
    }
  }

  test('renders title and author', () => {

    render(<Blog blog={ testBlog } />)

    const element = screen.getByText('Today I learned Hessu H.')
    expect(element).toBeDefined()
  })

  test('renders url, likes and user after clicking view', async () => {
    render(<Blog blog={ testBlog }/>)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    screen.getByText('ankka.net/blogs/21') //Check for url
    screen.getByText('Hessu') // user's name
    screen.getByText('likes 4') // likes
  })

  test('clicking like twice calls addLike twice', async () => {
    const mockLikeHandler = vi.fn()
    render(<Blog blog={ testBlog } addLike={ mockLikeHandler }/>)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })
})