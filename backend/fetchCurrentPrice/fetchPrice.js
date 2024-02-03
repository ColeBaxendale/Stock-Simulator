/**
 * API Usage
 * 
 * Filename: fetchPrice.js
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [January 2024]
 * Version: 1.0
 * 
 * Description: 
 * This module is designed to interface with the Alpha Vantage API for retrieving real-time 
 * stock prices. It encapsulates the functionality required to query current stock prices 
 * using a stock symbol. This abstraction simplifies the process of fetching stock data 
 * elsewhere in the application, promoting code reusability and separation of concerns. 
 * The module handles API interaction, parameter passing, response parsing, and error 
 * handling related to stock price retrieval, offering a streamlined and efficient 
 * method for accessing critical financial data.
 * 
 * Update History:
 * - [January 24, 2024]: [Initial setup]
 * 
 */

const axios = require('axios');

// Alpha Vantage API base URL and API key
const baseUrl = 'https://www.alphavantage.co/query';
const apiKey = process.env.ALPHA_ADV_API;

/**
 * Fetches the current stock price from Alpha Vantage API.
 * @param {string} symbol - The symbol of the stock to fetch the price for.
 * @returns {Promise<number>} - The current price of the stock.
 * @throws {Error} - Throws an error if the stock symbol is not found or the API fails to respond.
 */
async function fetchStockPrice(symbol) {
    // Check if the symbol is missing or empty
    if (!symbol || symbol === '') {
        return res.status(400).json({ message: 'Symbol is required' });
    }

    // Test for input length exceeding maximum allowed
    if (symbol.length > 5) {
        return res.status(400).json({ message: 'Input length exceeds maximum allowed' });
    }
    const functionParam = 'GLOBAL_QUOTE';
    const response = await axios.get(baseUrl, {
        params: {
            function: functionParam,
            symbol: symbol,
            apikey: apiKey,
        },
    });

    const quoteData = response.data['Global Quote'];
    if (!quoteData) {
        throw new Error('Stock symbol not found or data not available');
    }

    return parseFloat(quoteData['05. price']);
}

module.exports = { fetchStockPrice };
