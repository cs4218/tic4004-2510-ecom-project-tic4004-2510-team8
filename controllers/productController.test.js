import { jest, describe, it, expect, beforeEach} from '@jest/globals';
import {searchProductController, productFiltersController } from './productController.js'
import productModel from '../models/productModel.js';

describe('Product Controller Tests', () => {
    let req, res;

    // Establish dependency before each test
    beforeEach(() => {
        req = {
            params: {},
            body: {}
        }

        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }
        //Mock MongoDB model 
        productModel.find = jest.fn()
    })

    /**
     * Search has 1 input parameter (keyword)
     * Categorised the partition for input as valid string with matching result, valid string with non-matching result and empty input
     */
    describe('Search product tests using Equivalence Parititions', () => {

        it('Valid String with matching results, return produces when keyword matches', async() => {
            //Arrange
            const mockProducts = [
                { _id: '1', name: 'Laptop', description: 'Gaming laptop', price: 1000 },
                { _id: '2', name: 'Laptop Pro', description: 'Professional laptop', price: 1500 }    
            ];
            const keyword = 'laptop'

            req.params = {keyword: keyword};
            productModel.find.mockReturnValue({select: jest.fn().mockResolvedValue(mockProducts)});

            //Act
            await searchProductController(req,res);

            //Assert
            expect(productModel.find).toHaveBeenCalledWith({
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { description: { $regex: keyword, $options: 'i' } }
                  ]
            })
            expect(res.json).toHaveBeenCalledWith(mockProducts)
        })
    })






})