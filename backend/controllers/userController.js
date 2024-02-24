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
 * 
 * Time Complexity: O(1)
 */
exports.register = async (req, res) => {
    try {
        // Extract user details from the request body
        const { username, email, password, securityQuestions } = req.body;

        // Convert email to lowercase for consistent handling
        const emailLC = email.toLowerCase();

        // Validate user input
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required.' });
        }

        // Validate input lengths
        if (username.length > 50 || email.length > 100 || password.length > 100) {
            return res.status(400).json({ message: 'Input length exceeds maximum allowed.' });
        }

        // Validate username length
        if (username.length < 4) {
            return res.status(400).json({ message: 'Username must be at least 4 characters.' });
        }

        // Validate email format using regex
        const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(emailLC)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        // Validate password format
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: 'Password must be at least 8 characters with a mix of letters, numbers, and symbols.' });
        }

        // Check if a user with the given email already exists
        const existingUser = await User.findOne({ email: emailLC });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use.' });
        }

        // Hash the password for secure storage
        const hashedPassword = await bcrypt.hash(password, 10);

        // Hash security questions' answers
        const hashedSecurityQuestions = securityQuestions.map(q => ({
            question: q.question,
            answerHash: bcrypt.hashSync(q.answer, 10),
        }));

        // Create a new user with the provided details
        const newUser = new User({
            username,
            email: emailLC, // Assign the lowercase email here
            passwordHash: hashedPassword,
            portfolio: new Map(),
            securityQuestions: hashedSecurityQuestions,
            themePreference: 'light'
        });

        // Save the new user to the database
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ message: error.message });
    }
};


/**
 * Handles user login.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * 
 * Time Complexity: O(1)
 */
exports.login = async (req, res) => {
    // Validate request body for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const emailLC = email.toLowerCase();
        // Validate input
        if (!emailLC || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Test for input length exceeding maximum allowed
        if (emailLC.length > 100 || password.length > 100) {
            return res.status(400).json({ message: 'Input length exceeds maximum allowed' });
        }

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
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Send the token as the response
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Processes a stock purchase for a user.
 * @param {Request} req - Express request object with user ID, stock symbol, and quantity.
 * @param {Response} res - Express response object.
 * 
 * Time Complexity: O(1)
 */

/**
 * Processes a stock sale for a user.
 * @param {Request} req - Express request object with user ID, stock symbol, and quantity.
 * @param {Response} res - Express response object.
 * 
 * Time Complexity: O(1)
 */
exports.sellStock = async (req, res) => {
    try {
        // Extract sell details from the request body
        const { symbol, quantity, currentPrice } = req.body;
        const userId = req.user.userId;

        // Validate input
        if (!symbol || !quantity || isNaN(quantity) || quantity <= 0 || !currentPrice || isNaN(currentPrice) || currentPrice <= 0 || currentPrice >= 500000) {
            return res.status(400).json({ message: 'Invalid input' });
        }

        // Check for input length exceeding maximum allowed
        if (symbol.length > 5) {
            return res.status(400).json({ message: 'Symbol length exceeds maximum allowed' });
        }

        if (quantity > 1000) {
            return res.status(400).json({ message: 'Quantity exceeds maximum allowed' });
        }

        // Fetch user and stock price from the database and API, respectively
        const user = await User.findById(userId);

        // Check if the user has enough shares to sell
        const userStockQuantity = user.portfolio.get(symbol) || 0;
        if (quantity > userStockQuantity) {
            return res.status(400).json({ message: 'Insufficient shares to sell' });
        }

        // Execute the sell stock operation
        const result = await sellStockPortfolio(user, symbol, quantity, currentPrice);
        if (!result) {
            // Record the transaction
            await addTransaction(user, 'SELL', symbol, quantity, currentPrice);

            // Save the updated user details to the database
            await saveUserDetails(user);

            // Respond to the request indicating successful sale
            res.status(201).json({ message: `User sold ${quantity} shares of ${symbol} and user account saved` });
        } else {
            res.status(400).json({ message: result });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.buyStock = async (req, res) => {
    try {
        // Extract buy details from the request body
        const { symbol, quantity, currentPrice } = req.body;
        const userId = req.user.userId;

        // Validate input
        if (!symbol || !quantity || isNaN(quantity) || quantity <= 0 || !currentPrice || isNaN(currentPrice) || currentPrice <= 0 || currentPrice >= 500000) {
            return res.status(400).json({ message: 'Invalid input' });
        }

        // Check for input length exceeding maximum allowed
        if (symbol.length > 5) {
            return res.status(400).json({ message: 'Symbol length exceeds maximum allowed' });
        }

        if (quantity > 1000) {
            return res.status(400).json({ message: 'Quantity exceeds maximum allowed' });
        }

        // Fetch user from the database
        const user = await User.findById(userId);

        // Check if the user is not found
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has enough funds
        const totalCost = quantity * currentPrice;
        if (totalCost > user.balance) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        // Execute the buy stock operation
        const result = await buyStockPortfolio(user, symbol, quantity, currentPrice);
        if (!result) {
            // Record the transaction
            await addTransaction(user, 'BUY', symbol, quantity, currentPrice);

            // Save the updated user details to the database
            await saveUserDetails(user);
            res.status(201).json({ message: `User purchased ${quantity} shares of ${symbol} for $${currentPrice} a share and user account saved` });
        } else {
            res.status(400).json({ message: result });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/*
 * Processes a deposit into a user's account.
 * @param {Request} req - Express request object with user ID and deposit amount.
 * @param {Response} res - Express response object.
 * 
 * Time Complexity: O(1)
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
        if (isNaN(amountNum) || amountNum <= 0 || amountNum > maxDepositAmount) {
            return res.status(400).json({ message: 'Invalid deposit amount' });
        }
        else if ((amountNum + user.buyingPower) > maxBuyingPower) {
            return res.status(400).json({ message: 'Over max buying power' });
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
 * Retrieves user's portfolio.
 * @param {Request} req - Express request object with user ID.
 * @param {Response} res - Express response object.
 * 
 * Time Complexity: O(1)
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
 * 
 * Time Complexity: O(1)
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
 * 
 * Time Complexity: O(1)
 */
async function saveUserDetails(user) {
    try {
        await user.save();
    } catch (error) {
        throw new Error('Error saving user data: ' + error.message);
    }
}

/**
 * Resets user's account to initial state.
 * @param {Request} req - Express request object with user ID.
 * @param {Response} res - Express response object.
 * 
 * Time Complexity: O(1)
 */
exports.resetUserAccount = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Retrieve user ID from request and fetch user's transactions
        const userId = req.user.userId;
        const user = await User.findById(userId);

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

/**
 * Retrieves user's details (username and email).
 * @param {Request} req - Express request object with user ID.
 * @param {Response} res - Express response object.
 * 
 * Time Complexity: O(1)
 */
exports.getUserDetails = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        } else {
            return res.status(200).json(user); // Return the entire user document
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
        return res.status(500).json({ message: error.message });
    }
};



exports.changePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { password, newPassword } = req.body;
        // Validate input
        if (!password || !newPassword) {
            return res.status(400).json({ message: 'Old password and new password are required' });
        }

        // Check if old and new passwords are the same
        if (password === newPassword) {
            return res.status(400).json({ message: 'New password must be different from the old password' });
        }

        // Validate new password format
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ message: 'New password must be at least 8 characters with a mix of letters, numbers, and symbols' });
        }

        // Find the user by email
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Compare the provided old password with the stored hash
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Old password is incorrect' });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password in the database
        user.passwordHash = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: 'User password has been changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error occurred' });
    }
};

exports.verifySecurityQuestions = async (req, res) => {
    const { email, answers } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let verificationPassed = true;

        // Use async/await with Promise.all to handle asynchronous comparison
        const verificationResults = await Promise.all(user.securityQuestions.map(async (question, index) => {
            const providedAnswer = answers.find(ans => ans.question.toLowerCase() === question.question.toLowerCase());
            console.log(providedAnswer);
            if (!providedAnswer) return false; // No answer provided for this question

            // Asynchronously compare the provided answer with the stored hash
            console.log( await bcrypt.compare(providedAnswer.answer, question.answerHash));
            return await bcrypt.compare(providedAnswer.answer, question.answerHash);
        }));

        // Check if all verifications passed
        verificationPassed = verificationResults.every(result => result === true);

        if (verificationPassed) {
            res.json({ message: 'Security questions verified successfully.' });
        } else {
            res.status(401).json({ message: 'Verification failed. Answers to security questions do not match.' });
        }
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ message: 'An error occurred while verifying security questions.' });
    }
};

exports.getThemePreference = async (req, res) => {
    const userId = req.user.userId; // Assuming you have a middleware to set req.user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ themePreference: user.themePreference });
};

exports.updateThemePreference = async (req, res) => {
    const userId = req.user.userId;
    const { themePreference } = req.body; // 'light' or 'dark'
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.themePreference = themePreference;
    await user.save();

    res.json({ message: 'Theme preference updated successfully' });
};


exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Validate input
        if (!email || !newPassword) {
            return res.status(400).json({ message: 'Email and new password are required' });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password in the database
        user.passwordHash = hashedPassword;
        await user.save();

        // Respond with a success message
        res.status(200).json({ message: 'User password has been reset successfully' });
    } catch (error) {
        // Handle errors
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'An error occurred while resetting user password' });
    }
};