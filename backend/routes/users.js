const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user_controller'); // Import the controller

const router = express.Router();

// POST /api/users/register
router.post('/register', [
    // Validation middleware if needed
], userController.registerUser);

// POST /api/users/login
router.post('/login', [
    // Validation middleware if needed
], userController.loginUser);

module.exports = router;
