/**
 * Authentication Middleware
 * 
 * Filename: authenticate.js
 * Author: Cole Baxendale
 * Contact: thecodercole@gmail.com
 * Created on: January 2024
 * Version: 1.0
 * 
 * Description: 
 * This file contains the middleware for authenticating JWT (JSON Web Tokens) tokens in the Stock Trading Application.
 * It is a critical component for securing routes by ensuring that only requests with a valid token can access protected resources.
 * The middleware checks for the presence of a JWT in the request header, verifies it against the secret key,
 * and, if valid, allows the request to proceed to the next middleware or route handler. This process helps maintain
 * the security and integrity of the application by preventing unauthorized access to sensitive information and functionalities.
 * 
 * The 'jsonwebtoken' package is utilized for decoding and verifying the tokens, leveraging environment variables for configuration.
 */

// Importing the jsonwebtoken package for token verification
const jwt = require('jsonwebtoken');

/**
 * Middleware function for authenticating JWT tokens.
 * It intercepts incoming requests and validates the JWT token provided in the Authorization header.
 * 
 * @param {Object} req - The request object from Express.js, containing HTTP request information.
 * @param {Object} res - The response object from Express.js, used to send back HTTP responses.
 * @param {Function} next - A callback function that passes control to the next middleware function in the stack.
 */
const authenticateToken = (req, res, next) => {
    // Retrieve the 'Authorization' header from the incoming request.
    const authHeader = req.headers['authorization'];

    // Extract the token from the 'Authorization' header. The token is expected to follow the format "Bearer <token>".
    const token = authHeader && authHeader.split(' ')[1];
    
    // Check if the token is not provided in the request header.
    if (token == null) {
        // If the token is not present, respond with a 401 Unauthorized status code.
        return res.sendStatus(401); // Indicate that authentication is necessary for access.
    }

    // Verify the provided token against the JWT secret key stored in environment variables.
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // Check if there was an error during token verification, such as if the token is expired or invalid.
        if (err) {
            // Respond with a 403 Forbidden status code if the token cannot be verified.
            return res.sendStatus(403); // Indicate that the server understands the request but refuses to authorize it.
        }

        // If the token is valid, attach the decoded user information to the request object.
        // This user information is typically used in subsequent middleware or route handlers.
        req.user = user;

        // Pass control to the next middleware function in the stack.
        next();
    });
};

// Export the authenticateToken middleware to make it available for use in other parts of the application.
// This enables it to be applied to routes that require authentication.
module.exports = authenticateToken;
