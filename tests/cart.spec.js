import { test, expect } from '@playwright/test';

test.describe('Cart UI Tests', () => {

    test.beforeEach(async ({page}) => {
        await page.goto('/', {waitUntil: 'domcontentloaded'});
    })

    test('Add item to cart from home page', async({page}) => {
        // Arrange
        const addToCartButton = page.getByRole('button', { name: 'ADD TO CART' }).first();
        
        // Act
        await addToCartButton.click();
        
        // Assert
        await expect(page.getByText(/Item Added to cart/i)).toBeVisible();
    });

    test('Display correct cart details after adding item', async({page}) => {
        // Arrange
        await page.getByRole('button', { name: 'ADD TO CART' }).first().click();
        
        // Act
        await page.getByRole('link', {name:'Cart'}).click();
        await page.waitForURL(/.*cart/, {waitUntil: 'domcontentloaded'});
        const cartItems = page.locator('.card');
        const cartCount = await cartItems.count();
        
        // Assert
        await expect(page.getByText(/You Have 1 items in your cart/i)).toBeVisible();
        expect(cartCount).toBe(1);
        await expect(cartItems.first()).toBeVisible();
    });
});