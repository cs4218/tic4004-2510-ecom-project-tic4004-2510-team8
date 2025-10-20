import { test, expect } from '@playwright/test';

test.describe('Auth Tests', () => {

    test.beforeEach(async ({page}) => {
        await page.goto('/', {waitUntil: 'domcontentloaded'});
    })

    test('Successful login by user', async({page}) => {

        //Arrange 
        await page.getByText('Login').click();
        await expect(page.getByText('LOGIN FORM')).toBeVisible();
        await page.getByPlaceholder('Enter Your Email').fill('test@example.com');
        await page.getByPlaceholder('Enter Your Password').fill('password123');
        
        //Act
        await page.getByRole('button', {name:'LOGIN'}).click();

        //Assert
        await page.waitForURL('/', {waitUntil:'domcontentloaded'});
        const authData = await page.evaluate(() => { 
            return localStorage.getItem('auth');//Check localstorage data to verify already logged in
        })
        expect(authData).toBeTruthy();
        const parsedAuth = JSON.parse(authData);
        expect(parsedAuth).toHaveProperty('success', true);
        expect(parsedAuth).toHaveProperty('token');
        expect(parsedAuth).toHaveProperty('user');
    })

    test('Failed login by user', async({page}) => {

        //Arrange 
        await page.getByText('Login').click();
        await expect(page.getByText('LOGIN FORM')).toBeVisible();
        await page.getByPlaceholder('Enter Your Email').fill('test@example.com');
        await page.getByPlaceholder('Enter Your Password').fill('wrong');
        
        //Act
        await page.getByRole('button', {name:'LOGIN'}).click();

        //Assert
        await expect(page.getByText(/Invalid Password/i)).toBeVisible();
        await expect(page).toHaveURL(/.*login/); //Verify not redirected since password wrong
        await expect(page.getByText('LOGIN FORM')).toBeVisible();
    })
})