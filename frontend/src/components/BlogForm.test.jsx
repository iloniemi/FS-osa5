import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { expect } from 'vitest'



describe('BlogForm', () => {
  test('create button calls given callback function with correct parameters', async () => {
    const mockHandleCreateBlog = vi.fn()
    render(<BlogForm handleCreateBlog={ mockHandleCreateBlog } />)

    const user = userEvent.setup()
    const createButton = screen.getByText('create')
    const titleField = screen.getByPlaceholderText('type in the title')
    const authorField = screen.getByPlaceholderText('type in the author')
    const urlField = screen.getByPlaceholderText('type in the url')

    await user.type(titleField, 'test title')
    await user.type(authorField, 'test author')
    await user.type(urlField, 'test.com')

    await user.click(createButton)

    expect(mockHandleCreateBlog.mock.calls).toHaveLength(1)
    expect(mockHandleCreateBlog.mock.calls[0][0]).toBe('test title')
    expect(mockHandleCreateBlog.mock.calls[0][1]).toBe('test author')
    expect(mockHandleCreateBlog.mock.calls[0][2]).toBe('test.com')
  })
})