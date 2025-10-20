import { test, expect } from '@playwright/test';

test.describe('Cart UI Tests', () => {
    test('Add User Cart from Home Page', async({page}) => {
        await page.goto('/', {waitUntil: 'domcontentloaded'});

        //Verify item added to cart
        const addToCartButton = page.getByRole('button', { name: 'ADD TO CART' }).first();
        await expect(addToCartButton).toBeVisible();
        await addToCartButton.click();
        await expect(page.getByText(/Item Added to cart/i)).toBeVisible();

        //Verify 1 item in cart
        await page.getByRole('link', {name:'Cart'}).click()
        await page.waitForURL(/.*cart/, {waitUntil: 'domcontentloaded'});
        await expect(page.getByText(/You Have 1 items in your cart/i)).toBeVisible();

        //Verify item is available in cart
        const cartItems = page.locator('.card');
        const cartCount = await cartItems.count();
        const itemCard = cartItems.first();
        expect(cartCount).toBe(1);
        await expect(itemCard).toBeVisible();
    })
})