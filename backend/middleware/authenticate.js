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
 * Update History:
 * - [January 24, 2024]: [Initial setup]
 * 
 */

const jwt = require('jsonwebtoken');

// Middleware function for authenticating tokens
const authenticateToken = (req, res, next) => {
    // Retrieve the authorization header from the request
    const authHeader = req.headers['authorization'];

    // Extract the token from the authorization header
    const token = authHeader && authHeader.split(' ')[1];
    
    // If the token is null (not present), return a 401 Unauthorized status
    if (token == null) return res.sendStatus(401);

    // Verify the token using jwt.verify
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // Log an error if there's an issue with the token verification
        if (err) {
            console.log('Error authorizing user');
            return res.sendStatus(403); // Forbidden status if the token is invalid
        }

        // If the token is valid, attach the user info to the request object
        req.user = user;

        // Call next to pass control to the next middleware function
        next();
    });
};

// Export the middleware function for use in other parts of the application
module.exports = authenticateToken;
