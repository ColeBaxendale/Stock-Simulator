/**
 * Authentication Middleware
 * 
 * Filename: authenticate.js
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [January 2024]
 * Version: 1.0
 * 
 * Description: 
 * This file contains the middleware for authenticating JWT tokens in the Stock Trading Application.
 * It is used to secure routes by ensuring that a valid token is present in the request header.
 * This middleware checks for the presence of a token, verifies it, and if valid, allows
 * access to protected routes. It is a crucial part of the application's security layer.
 * 
 * The middleware uses the 'jsonwebtoken' package to validate the tokens.
 * 
 */

const jwt = require('jsonwebtoken');

// Middleware function for authenticating tokens
const authenticateToken = (req, res, next) => {
    // Retrieve the authorization header from the request
    const authHeader = req.headers['authorization'];

    // Extract the token from the authorization header
    const token = authHeader && authHeader.split(' ')[1];
    
    // Test 1: Token Validation
    if (token == null) {
        return res.sendStatus(401); // Test: Token Not Provided
    }

    // Test 2: Token Expiry
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // Test 3: Error Handling
        if (err) {
            console.error('Error authorizing user:', err);
            return res.sendStatus(403); // Test: Token Verification Failure
        }

        // If the token is valid, attach the user info to the request object
        req.user = user;

        // Call next to pass control to the next middleware function
        next();
    });
};

// Export the middleware function for use in other parts of the application
module.exports = authenticateToken;
