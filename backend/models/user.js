/**
 * User Model
 * 
 * Filename: user.js
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [January 2024]
 * Version: 1.0
 * 
 * Description: 
 * This file defines the schema and model for User in the Stock Trading Application using Mongoose.
 * It includes essential user attributes like email, username, passwordHash, buying power,
 * total investment, portfolio, and transaction history. The User model is a crucial component
 * for managing user data and their interactions with the stock market functionalities of the application.
 * 
 * The portfolio is implemented as a Map for efficient stock management, and transactions are stored
 * as an array to keep a record of all stock transactions made by the user.
 * 
 */
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Defining the schema for the User model
const userSchema = new mongoose.Schema({
    // User's email, required and must be unique
    email: { type: String, required: true, unique: true },

    // User's username, required
    username: { type: String, required: true },

    // Hashed password for the user, required for security
    passwordHash: { type: String, required: true },

    // Buying power represents how much the user can spend, with a default value and rounded to 2 decimal places
    buyingPower: { type: Number, default: 1000, set: v => parseFloat(v.toFixed(2)) },

    // Total amount the user has invested, with a default value and rounded to 2 decimal places
    totalInvestment: { type: Number, default: 1000, set: v => parseFloat(v.toFixed(2)) },

    // Portfolio of the user, stored as a Map with each entry containing details of a stock
    portfolio: {
        type: Map,
        of: {
            quantityOwned: Number, // Number of shares owned for a stock
            averageBuyPrice: Number // Average buy price of the stock
        }
    },

    // Array of transaction objects, recording the user's stock transactions
    transactions: [
        {
            transactionType: String, // Type of transaction - 'buy' or 'sell'
            symbol: String, // Ticker symbol of the stock
            quantity: Number, // Number of shares involved in the transaction
            price: Number, // Price per share for the transaction
            totalPrice: Number, // Total price of the transaction
            timestamp: Date // Timestamp when the transaction occurred
        }],
    securityQuestions: [{
        question: String,
        answerHash: {
            type: String,
            required: true,
            set: answer => bcrypt.hashSync(answer, 10) // Automatically hash answers when set
        }
    }],
    themePreference: { type: String, default: 'light' } // 'light' or 'dark'
});

// Exporting the User model for use in other parts of the application
const User = mongoose.model('User', userSchema);

module.exports = User;
