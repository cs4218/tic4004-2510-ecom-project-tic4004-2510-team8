import { jest, describe, it, expect, beforeEach} from '@jest/globals';
import { registerController, loginController } from './authController.js'
import { hashPassword } from "./../helpers/authHelper.js";  
import userModel from '../models/userModel.js';

/**
 * Register has 6 input paramaters (name,email,password,phone,address and answer)
 * Tested using equivalence partitioning by categorising input into 3 partitions
 * Valid: All required fields are present
 * Invalid: Missing 1 or more inputs
 * Existing user: Email already registered
 */
describe('Register Controller Tests', () => {
    let req, res;

    // Establish dependency before each test
    beforeEach(() => {
        req = { body: {} };

        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    })


    it('Valid register, register new user with valid inputs', async () => {
        // Arrange
        const testUserData = {
            name: 'Superman',
            email: 'superman@example.com',
            password: 'password123',
            phone: '1234567890',
            address: '123 Superman St',
            answer: 'Flying'
        };
        const id = '123'
        const hashed_password = 'hashed_password'
        req.body = testUserData;
    
        jest.spyOn(userModel, 'findOne').mockResolvedValue(null);
        jest.spyOn(userModel.prototype, 'save').mockResolvedValue({
            _id: id,
            ...req.body,
            password: hashed_password
        });
    
        // Act
        await registerController(req, res);
    
        // Assert
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({
            success: true,
            message: 'User Register Successfully',
            user: expect.objectContaining({
                _id: id,
                name: testUserData.name,
                email: testUserData.email,
                phone: testUserData.phone,
                address: testUserData.address,
                answer: testUserData.answer,
                password: hashed_password
            })
        });
    });

    it('Invalid register, missing inputs', async () => {
        //Arrange
        const testUserData = {
            name: 'Superman',
            password: 'password123',
            phone: '1234567890',
            address: '123 Superman St',
            answer: 'Flying'
        };
        req.body = testUserData;

        //Act
        await registerController(req,res);

        //Assert
        expect(res.send).toHaveBeenCalledWith({
            message: 'Email is Required'
        });
    })

    it('Existing user, duplicate email in register', async () => {
        //Arrange
        const testUserData = {
            name: 'Superman',
            email: 'superman@example.com',
            password: 'password123',
            phone: '1234567890',
            address: '123 Superman St',
            answer: 'Flying'
        };
        req.body = testUserData;
        jest.spyOn(userModel, 'findOne').mockResolvedValue('superman@example.com');

        //Act
        await registerController(req,res);

        //Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: 'Already Register please login'
        });
    })
})

/**
 * Login controller has 2 input parameter (email,password)
 * Tested using equivalanece partition by categorising input into valid or invalid
 */
describe('Login Controller Tests', () => {
    let req, res;

    // Establish dependency before each test
    beforeEach(() => {
        process.env.JWT_SECRET = 'testSecret';  
        req = { body: {} };

        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    })

    it('Valid inputs, user successfully login with valid credentials', async () => {
        //Arrange
        req.body = {
            email: 'superman@example.com',
            password: 'password123',
        };
        const hashedPassword = await hashPassword('password123');
    
        const mockUser = {
          _id: '123',
          name: 'Superman',
          email: 'superman@example.com',
          password: hashedPassword,
          phone: '1234567890',
          address: '123 Superman St',
          role: 0
        };
    
        jest.spyOn(userModel, 'findOne').mockResolvedValue(mockUser);
    
        //Act
        await loginController(req, res);
    
        //Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
          expect.objectContaining({
            success: true,
            message: 'login successfully'
          })
        );
      });

      it('Invalid, user rejected when password incorrect', async () => {
        //Arrange
        req.body = {
            email: 'superman@example.com',
            password: 'wrongpassword'
        };
    
        const mockUser = {
            _id: '123',
            name: 'Superman',
            email: 'superman@example.com',
            password: 'password123',
            phone: '1234567890',
            address: '123 Superman St',
            role: 0
          };
    
        jest.spyOn(userModel, 'findOne').mockResolvedValue(mockUser);
    
        //Act
        await loginController(req, res);
    
        //Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
          expect.objectContaining({
            success: false,
            message: 'Invalid Password'
          })
        );
    });

})