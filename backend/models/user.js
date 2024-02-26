/**
 * User Model
 * 
 * Filename: user.js
 * Author: Cole Baxendale
 * Contact: thecodercole@gmail.com
 * Created on: January 2024
 * Version: 1.0
 * 
 * Description: 
 * This file defines the schema and model for User in the Stock Trading Application using Mongoose.
 * It includes essential user attributes like email, username, passwordHash, buying power,
 * total investment, portfolio, and transaction history. The User model is a crucial component
 * for managing user data and their interactions with the stock market functionalities of the application.
 * 
 * The portfolio is implemented as a Map for efficient stock management, and transactions are stored
 * as an array to keep a record of all stock transactions made by the user. Additionally, security
 * questions are used for account recovery, and theme preference allows for personalized UI experiences.
 */

// Import bcryptjs for password hashing. This is important for storing passwords securely.
const bcrypt = require('bcryptjs');

// Import mongoose, an ODM (Object Document Mapping) library for MongoDB. It manages relationships between data, provides schema validation, etc.
const mongoose = require('mongoose');

// Defining the schema for the User model with various fields.
const userSchema = new mongoose.Schema({
    // User's email, it is required and must be unique to avoid duplicate accounts.
    email: { type: String, required: true, unique: true },

    // User's username, also required.
    username: { type: String, required: true },

    // Password hash instead of the plaintext password for security purposes, required.
    passwordHash: { type: String, required: true },

    // Buying power indicates the amount of money the user can use to buy stocks, with a default start value.
    buyingPower: { type: Number, default: 1000, set: v => parseFloat(v.toFixed(2)) },

    // Total investment reflects the total amount of money invested by the user, also with a default value.
    totalInvestment: { type: Number, default: 1000, set: v => parseFloat(v.toFixed(2)) },

    // The user's portfolio, represented as a Map for efficient lookup and modification of stock entries.
    portfolio: {
        type: Map,
        of: {
            quantityOwned: Number, // Specifies the number of shares the user owns of a particular stock.
            averageBuyPrice: Number // The average price at which the user bought the shares.
        }
    },

    // Records of stock transactions (buying/selling), stored as an array of objects.
    transactions: [
        {
            transactionType: String, // 'buy' or 'sell', indicating the type of transaction.
            symbol: String, // Stock symbol to identify the stock involved in the transaction.
            quantity: Number, // The number of shares traded.
            price: Number, // Price per share at the time of transaction.
            totalPrice: Number, // The total amount involved in the transaction.
            timestamp: Date // The date and time when the transaction took place.
        }],
    // Security questions for account recovery, stored as an array. Each question has an associated hashed answer for security.
    securityQuestions: [{
        question: String,
        answerHash: {
            type: String,
            required: true,
            answerHash: { type: String, required: true } // Redundant nested field, possibly an error. The inner 'answerHash' might be intended as 'answer'.
        }
    }],
    // User's preference for the application theme, defaulting to 'light'. Allows for a personalized user interface experience.
    themePreference: { type: String, default: 'light' } // 'light' or 'dark'
});

// Creating the User model from the schema. This model will be used for CRUD operations involving User documents in the database.
const User = mongoose.model('User', userSchema);

// Exporting the User model so it can be used in other parts of the application, like controllers.
module.exports = User;
