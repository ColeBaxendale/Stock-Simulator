/**
 * User Routes
 * 
 * Filename: users.js
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [January 2024]
 * Version: 1.0
 * 
 * Description: 
 * This file defines the routes for user-related operations such as registration, login, stock trading, 
 * and viewing portfolio and transaction history. It uses the express.Router to define routes and 
 * integrates userController for handling the logic associated with each route.
 * 
 * Each route is protected with authentication middleware where necessary, ensuring that only authenticated
 * users can access certain operations.
 * 
 */

const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const authenticateToken = require('../middleware/authenticate');

/**
 * POST route for user registration.
 * Users can register by providing their username, email, and password.
 * The request is handled by the 'register' function in the userController.
 */
router.post('/register', userController.register);

/**
 * POST route for user login.
 * Users can log in using their email and password.
 * The 'login' function in the userController processes the login request.
 */
router.post('/login', userController.login);

/**
 * POST route for buying stock.
 * Authenticated users can buy stocks by specifying the stock symbol and quantity.
 * This route is protected by the 'authenticateToken' middleware.
 * The 'buyStock' function in the userController handles the stock purchase.
 */
router.post('/buy-stock', authenticateToken, userController.buyStock);

/**
 * POST route for selling stock.
 * Authenticated users can sell stocks by specifying the stock symbol and quantity.
 * This route is protected by the 'authenticateToken' middleware.
 * The 'sellStock' function in the userController handles the stock selling.
 */
router.post('/sell-stock', authenticateToken, userController.sellStock);

/**
 * POST route for depositing money.
 * Authenticated users can deposit money into their account.
 * This route is protected by the 'authenticateToken' middleware.
 * The 'deposit' function in the userController handles the deposit request.
 */
router.post('/deposit', authenticateToken, userController.deposit);

/**
 * GET route for fetching a user's portfolio.
 * Authenticated users can retrieve their portfolio details.
 * This route is protected by the 'authenticateToken' middleware.
 * The 'getUserPortfolio' function in the userController returns the user's portfolio data.
 */
router.get('/portfolio', authenticateToken, userController.getUserPortfolio);

/**
 * GET route for fetching a user's transaction history.
 * Authenticated users can access their history of stock transactions.
 * This route is protected by the 'authenticateToken' middleware.
 * The 'getUserTransactions' function in the userController returns the user's transaction history.
 */
router.get('/transaction-history', authenticateToken, userController.getUserTransactions);

/**
 * PUT route for resetting the user's account back to default variables after registering.
 * Authenticated users can reset their account.
 * The 'resetUserAccount' function in the userController resets the user's account.
 */
router.put('/reset-account', authenticateToken, userController.resetUserAccount);

/**
 * GET route for fetching user details.
 * Authenticated users can retrieve their username and email.
 * This route is protected by the 'authenticateToken' middleware.
 * The 'getUserDetails' function in the userController returns the user's details.
 */
router.get('/user-details', authenticateToken, userController.getUserDetails);

/**
 * POST route for changing user details.
 * Authenticated users can change their email or username.
 * This route is protected by the 'authenticateToken' middleware.
 * The 'changeUserDetails' function in the userController handles the user details change.
 */
router.post('/change-password', authenticateToken, userController.changePassword);

// Export the router so it can be used in the main server file (usually server.js or app.js).
module.exports = router;
