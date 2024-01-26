/**
 * Stock Routes
 * 
 * Filename: stocks.js
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [January 2024]
 * Version: 1.0
 * 
 * Description:
 * This file contains the routes for stock-related operations like searching for stock prices,
 * viewing detailed stock information, and retrieving news about specific stocks. It defines 
 * routes using express.Router and uses methods from the stockController to handle the requests.
 * 
 * 
 * Update History:
 * - [January 24, 2024]: [Initial setup]
 */

const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

/**
 * GET route to search for a stock.
 * This route handles requests to search for a stock symbol and returns the current price.
 * It delegates the request handling to the 'searchStock' function in the stockController.
 */
router.get('/search', stockController.searchStock);

/**
 * GET route to view details of a specific stock.
 * This route provides detailed information about a particular stock, such as price, volume, etc.
 * It uses the 'viewStockDetails' function in the stockController for processing.
 */
router.get('/stock', stockController.viewStockDetails);

/**
 * GET route to retrieve news related to a specific stock symbol.
 * This route fetches news articles and sentiment data related to the given stock symbol.
 * It uses the 'getStockNews' function in the stockController.
 */
router.get('/news', stockController.getStockNews);

// Exporting the router so it can be used in the main server file (usually server.js or app.js).
module.exports = router;
