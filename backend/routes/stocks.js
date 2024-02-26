/**
 * Stock Routes
 * 
 * Filename: stocks.js
 * Author: Cole Baxendale
 * Contact: thecodercole@gmail.com
 * Created on: January 2024
 * Version: 1.0
 * 
 * Description:
 * This file contains the routes for stock-related operations like searching for stock prices,
 * viewing detailed stock information, and retrieving news about specific stocks. It defines 
 * routes using express.Router and uses methods from the stockController to handle the requests.
 * These routes are essential for the functioning of a stock market analysis or trading application,
 * allowing users to interact with and retrieve data related to stocks through a web interface.
 */

// Importing the necessary modules. Here, 'express' is a web application framework that provides a robust set of features to develop web and mobile applications.
const express = require('express');

// Initializing the router. This is part of Express's routing system, which allows us to define routes based on HTTP methods and paths.
const router = express.Router();

// Importing the stockController module. This module is expected to contain the logic for handling requests related to stock operations.
const stockController = require('../controllers/stockController');

/**
 * GET route to search for a stock.
 * This route handles requests to search for a stock symbol and returns the current price.
 * It delegates the request handling to the 'searchStock' function in the stockController.
 * Path: '/search'
 * Method: GET
 * Function: searchStock
 */
router.get('/search', stockController.searchStock);

/**
 * GET route to view details of a specific stock.
 * This route provides detailed information about a particular stock, such as price, volume, etc.
 * It uses the 'viewStockDetails' function in the stockController for processing.
 * Path: '/stock'
 * Method: GET
 * Function: viewStockDetails
 */
router.get('/stock', stockController.viewStockDetails);

/**
 * GET route to retrieve news related to a specific stock symbol.
 * This route fetches news articles and sentiment data related to the given stock symbol.
 * It uses the 'getStockNews' function in the stockController for processing.
 * Path: '/news'
 * Method: GET
 * Function: getStockNews
 */
router.get('/news', stockController.getStockNews);

/**
 * GET route to search for stocks in a search bar.
 * This route handles requests to search for stocks using a search bar.
 * It delegates the request handling to the 'searchBar' function in the stockController.
 * Path: '/searchbar'
 * Method: GET
 * Function: searchBar
 */
router.get('/searchbar', stockController.searchBar);

// Exporting the router so it can be used in the main server file (usually server.js or app.js).
// This makes the routes defined here accessible to the rest of the application.
module.exports = router;
