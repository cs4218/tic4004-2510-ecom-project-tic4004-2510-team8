import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import CartPage from './CartPage';
import { useCart } from '../context/cart'
import { useAuth } from '../context/auth'
import { useSearch} from '../context/search'
import { describe } from 'node:test';


jest.mock('../context/auth');
jest.mock('../context/cart');
jest.mock('../context/search');

Object.defineProperty(window, 'localStorage', {
    value: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn()
    },
    writable: true,
})

/**
 * Using principles of BVA, the unit test aims to test around the transition points
 * Test test is done at 0, 0->1 and 1-> 0 items 
 */
describe('Cart Components using BVA', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useAuth.mockReturnValue([
            {user: { name: 'Super User', address: 'NUS'}, token: 'testToken'},
            jest.fn()
        ]);
        useSearch.mockReturnValue([{keyword:''}, jest.fn()])
    })

    it('Empty cart, should display empty cart when no item', () => {
        useCart.mockReturnValue([[], jest.fn()]);

        const { getByText } = render(
            <MemoryRouter>
            <CartPage/>
            </MemoryRouter>
        )

        expect(getByText(/your cart is empty/i)).toBeInTheDocument();
    })

})

