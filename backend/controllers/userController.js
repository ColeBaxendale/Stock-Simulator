/**
 * User Controller
 * 
 * Filename: userController.js
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [January 2024]
 * Version: 1.0
 * 
 * Description: 
 * This module provides the core functionality for user management and stock transaction 
 * processing in the application. It includes methods for user registration, login, 
 * stock buying and selling, depositing funds, and fetching user portfolio and transaction 
 * history. The controller uses Mongoose for database operations and integrates with the 
 * Alpha Vantage API for real-time stock data. Each function is designed to handle specific 
 * API requests, ensuring robustness and reliability in user and stock data management.
 * 
 * 
 * Update History:
 * - [January 24, 2024]: [Initial setup]
 * 
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const { fetchStockPrice } = require('../fetchCurrentPrice/fetchPrice');
const { buyStockPortfolio, addTransaction, sellStockPortfolio } = require('./buySellController');

/**
 * Handles user registration.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if a user with the given email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password for secure storage
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with the provided details
        const newUser = new User({
            username,
            email,
            passwordHash: hashedPassword,
            portfolio: new Map() // Initialize an empty portfolio
        });

        // Save the new user to the database
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Handles user login.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
exports.login = async (req, res) => {
    // Validate request body for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token for the user
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the token as the response
        res.json({ token, username: user.username});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Processes a stock purchase for a user.
 * @param {Request} req - Express request object with user ID, stock symbol, and quantity.
 * @param {Response} res - Express response object.
 */
exports.buyStock = async (req, res) => {
    try {
        // Extract buy details from the request body
        const { symbol, quantity } = req.body;
        const userId = req.user.userId;

        // Fetch user and stock price from the database and API, respectively
        const user = await User.findById(userId);
        const stockPrice = await fetchStockPrice(symbol);

        // Execute the buy stock operation
        await buyStockPortfolio(user, symbol, quantity, stockPrice);

        // Record the transaction
        await addTransaction(user, 'BUY', symbol, quantity, stockPrice);

        // Save the updated user details to the database
        await saveUserDetails(user);

        // Respond to the request indicating successful purchase
        res.status(201).json({ message: `User purchased ${quantity} shares of ${symbol} and user account saved` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Processes a stock sale for a user.
 * @param {Request} req - Express request object with user ID, stock symbol, and quantity.
 * @param {Response} res - Express response object.
 */
exports.sellStock = async (req, res) => {
    try {
        // Extract sell details from the request body
        const { symbol, quantity } = req.body;
        const userId = req.user.userId;

        // Fetch user and stock price from the database and API, respectively
        const user = await User.findById(userId);
        const stockPrice = await fetchStockPrice(symbol);

        // Execute the sell stock operation
        await sellStockPortfolio(user, symbol, quantity, stockPrice);

        // Record the transaction
        await addTransaction(user, 'SELL', symbol, quantity, stockPrice);

        // Save the updated user details to the database
        await saveUserDetails(user);

        // Respond to the request indicating successful sale
        res.status(201).json({ message: `User sold ${quantity} shares of ${symbol} and user account saved` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/*
* Processes a deposit into a user's account.
* @param {Request} req - Express request object with user ID and deposit amount.
* @param {Response} res - Express response object.
*/
exports.deposit = async (req, res) => {
    try {
        // Parse and validate the deposit amount
        const { amount } = req.body;
        const amountNum = Number(amount);
        const userId = req.user.userId;
        const user = await User.findById(userId);
        const maxDepositAmount = 100000;
        const maxBuyingPower = 100000000;

        // Check for invalid or excessive deposit amounts
        if (isNaN(amountNum)) {
            return res.status(400).json({ message: `Please enter a valid number` });
        }
        if (amountNum <= 0) {
            return res.status(400).json({ message: `Please enter a number greater than zero` });
        }
        if (amountNum > maxDepositAmount) {
            return res.status(400).json({ message: `The max amount you can deposit at one time is $100,000` });
        }
        if (amountNum + user.buyingPower > maxBuyingPower) {
            const maxDepositAllowed = (maxBuyingPower - user.buyingPower).toFixed(2);
            return res.status(400).json({ message: `The max amount you can have in buying power is $100,000,000. The most you can deposit is ${maxDepositAllowed}` });
        }

        // Update the user's buying power and total investment
        user.buyingPower += amountNum;
        user.totalInvestment += amountNum;

        // Save the updated user details to the database
        await saveUserDetails(user);
        res.status(201).json({ message: `User deposited $${amountNum} into their account` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Retrieves user's portfolio and transaction history.
 * @param {Request} req - Express request object with user ID.
 * @param {Response} res - Express response object.
 */
exports.getUserPortfolioTransactions = async (req, res) => {
    try {
        // Retrieve user ID from request and fetch user details
        const userId = req.user.userId;
        const user = await User.findById(userId).select('portfolio transactions');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with both portfolio and transaction history
        res.status(200).json({
            portfolio: user.portfolio,
            transactions: user.transactions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Retrieves user's portfolio.
 * @param {Request} req - Express request object with user ID.
 * @param {Response} res - Express response object.
 */
exports.getUserPortfolio = async (req, res) => {
    try {
        // Retrieve user ID from request and fetch user's portfolio
        const userId = req.user.userId;
        const user = await User.findById(userId).select('portfolio');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with user's portfolio
        res.status(200).json({
            portfolio: user.portfolio,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Retrieves user's transaction history.
 * @param {Request} req - Express request object with user ID.
 * @param {Response} res - Express response object.
 */
exports.getUserTransactions = async (req, res) => {
    try {
        // Retrieve user ID from request and fetch user's transactions
        const userId = req.user.userId;
        const user = await User.findById(userId).select('transactions');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with user's transaction history
        res.status(200).json({
            transactions: user.transactions,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Helper function to save user details to the database.
 * @param {User} user - User document to be saved.
 * @throws {Error} - Throws an error if saving fails.
 */
async function saveUserDetails(user) {
    try {
        await user.save();
    } catch (error) {
        throw new Error('Error saving user data: ' + error.message);
    }
}


exports.resetUserAccount = async (req, res) => {
    try {
        // Retrieve user ID from request and fetch user's transactions
        const userId = req.user.userId;
        const user = await User.findById(userId).select('transactions');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Reset user's portfolio, transactions, and buying power
        user.portfolio = new Map(); // Initialize portfolio if it's undefined
        user.transactions = []; // Clear transactions array
        user.buyingPower = 1000; // Reset buying power to initial value, or any other value as per business logic
        user.totalInvestment = 1000;
        // Save the updated user details
        await user.save();

        // Respond with a success message
        res.status(200).json({ message: 'User account has been reset successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};