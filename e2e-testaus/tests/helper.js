const loginWith = async (page, username, password) => {
  await page.getByTestId('login-username').fill(username)
  await page.getByTestId('login-password').fill(password)
  await page.getByTestId('login-submit-button').click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByText('new blog').click()

  await page.getByTestId('new-blog-title').fill(title)
  await page.getByTestId('new-blog-author').fill(author)
  await page.getByTestId('new-blog-url').fill(url)
  await page.getByTestId('new-blog-submit-button').click()
  await page.getByText(`${title} ${author}`).waitFor()
}

export { loginWith, createBlog }