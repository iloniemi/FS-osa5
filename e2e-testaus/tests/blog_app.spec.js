const { test, expect, beforeEach, describe } = require('@playwright/test')
const {loginWith, createBlog} = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Aku ankka',
        username: 'aku',
        password: 'ankka'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('login-header')).toBeVisible()
    await expect(page.getByTestId('login-username')).toBeVisible()
    await expect(page.getByTestId('login-password')).toBeVisible()
    await expect(page.getByTestId('login-submit-button')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'aku', 'ankka')
    
      await expect(page.getByText('Aku ankka logged in')).toBeVisible()
    })
    
    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'tupu', 'ankka')
    
      await expect(page.getByText('wrong credentials')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'aku', 'ankka')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Ankkalinna jee!', 'Ankkojen fani', 'ankkalinna.net/blogs/38')
      await expect(page.getByText('Ankkalinna jee! Ankkojen fani')).toBeVisible()
    })

    describe('and one blog created', ()=> {
      beforeEach(async ({page}) => {
        await createBlog(page, 'Ankkalinna jee!', 'Ankkojen fani', 'ankkalinna.net/blogs/38')
      })

      test('blog can be liked', async ({page}) => {
        await page.getByTestId(/blog-info-toggle-button-.*/).click()
        await page.getByTestId(/blog-like-button-.*/).click()
        await expect(page.getByText('likes 1')).toBeVisible()

        //const buttonTestId = await page.getByTestId(/blog-like-button-.*/).getAttribute('data-testid')
        //console.log('napin testid', buttonTestId) substring(idteksti.length()) käyttöön 
        
      })

      test('that blog can be removed', async ({page}) => {
        await page.getByTestId(/blog-info-toggle-button-.*/).click()
        page.on('dialog', dialog => dialog.accept())
        await page.getByTestId(/blog-remove-button-.*/).click()
        await expect(page.getByText('Ankkalinna jee! Ankkojen fani')).toHaveCount(0)
      })

      test('user does not have remove button for blog of another user', async ({page, request}) => {
        await page.getByTestId('logout-button').click()
        await request.post('/api/users', {
          data: {
            name: 'Hannu Hanhi',
            username: 'hannu',
            password: 'hanhi'
          }
        })
        await loginWith(page, 'hannu', 'hanhi')
        await page.getByTestId(/blog-info-toggle-button-.*/).click()
        await expect(page.getByText(/blog-remove-button-.*/)).toHaveCount(0)
      })
      
      test.only('blogs are in order of likes', async ({page}) => {
        await createBlog(page, 'Hanhivaara voittaa!', 'Taku', 'oravat.info/blogs/3453')

        await page.getByText('Hanhivaara voittaa! Taku').waitFor()
        // Getting the order of blogs and ids
        const locatorsBefore = await page
          .getByTestId(/blog-info-toggle-button-.*/)
          .all()
        expect(locatorsBefore).toHaveLength(2)
        
        const firstToggleIdBefore = await locatorsBefore[0].getAttribute('data-testid')
        const secondToggleIdBefore = await locatorsBefore[1].getAttribute('data-testid')

        const firstLikeButtonId = firstToggleIdBefore.replace('blog-info-toggle-button-', 'blog-like-button-')
        const secondLikeButtonId = secondToggleIdBefore.replace('blog-info-toggle-button-', 'blog-like-button-')
        
        // Opening extra info views
        await page.getByTestId(firstToggleIdBefore).click()
        await page.getByText('ankkalinna.net/blogs/38').waitFor()
        await page.getByTestId(secondToggleIdBefore).click()
        await page.getByText('oravat.info/blogs/3453').waitFor()
        

        // Adding one like to first and two to second
        await page.getByTestId(secondLikeButtonId).click()
        page.getByText('likes 1').waitFor()
        await page.getByTestId(secondLikeButtonId).click()
        page.getByText('likes 2').waitFor()
        await page.getByTestId(firstLikeButtonId).click()
        page.getByText('likes 1').waitFor()

        // Checking the order again
        const locatorsAfter = await page
          .getByTestId(/blog-info-toggle-button-.*/)
          .all()
        expect(locatorsAfter).toHaveLength(2)

        const firstToggleIdAfter = await locatorsAfter[0].getAttribute('data-testid')
        const secondToggleIdAfter = await locatorsAfter[1].getAttribute('data-testid')

        // Checking they have switched order after more likes to second one
        expect(firstToggleIdBefore).toEqual(secondToggleIdAfter)
        expect(secondToggleIdBefore).toEqual(firstToggleIdAfter)
      }) 
    })
  })
})