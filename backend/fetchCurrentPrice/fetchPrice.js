/**
 * API Usage
 * 
 * Filename: fetchPrice.js
 * Author: Cole Baxendale
 * Contact: thecodercole@gmail.com
 * Created on: January 2024
 * Version: 1.0
 * 
 * Description: 
 * This module interfaces with the Alpha Vantage API to retrieve real-time stock prices efficiently.
 * It is designed to abstract the complexities involved in making HTTP requests to the Alpha Vantage API,
 * handling parameters, parsing the API response, and managing errors. By encapsulating these details,
 * the module offers a simple and reusable method for obtaining the current stock price by symbol,
 * facilitating easy integration into various parts of the stock trading application. This approach
 * enhances maintainability and ensures that stock price retrieval logic is centralized and consistent
 * across the application.
 */

// Importing the axios HTTP client to make requests to the Alpha Vantage API.
const axios = require('axios');

// Defining the base URL for the Alpha Vantage API and retrieving the API key from environment variables.
const baseUrl = 'https://www.alphavantage.co/query';
const apiKey = process.env.ALPHA_ADV_API;

/**
 * Asynchronously fetches the current stock price for a given symbol from the Alpha Vantage API.
 * @param {string} symbol - The stock symbol for which to fetch the current price.
 * @returns {Promise<number>} - A promise that resolves to the current price of the specified stock.
 * @throws {Error} - Throws an error if the stock symbol is not found, or if there's a failure in the API request.
 * 
 * This function is designed to be used asynchronously, utilizing JavaScript's async/await syntax for readability
 * and simplicity in handling asynchronous operations. The function makes a GET request to the Alpha Vantage API,
 * specifying the 'GLOBAL_QUOTE' function to retrieve real-time price data for the given stock symbol. The API key
 * is included in the request parameters to authenticate the request.
 */
async function fetchStockPrice(symbol) {
    // Validating the input symbol to ensure it is provided and does not exceed expected length constraints.
    if (!symbol || symbol === '') {
        throw new Error('Symbol is required for fetching stock price.');
    }
    if (symbol.length > 5) {
        throw new Error('Input length exceeds maximum allowed for a stock symbol.');
    }

    // Defining the API function parameter for fetching global stock quotes.
    const functionParam = 'GLOBAL_QUOTE';

    // Making the API request to Alpha Vantage and awaiting the response.
    const response = await axios.get(baseUrl, {
        params: {
            function: functionParam,
            symbol: symbol,
            apikey: apiKey,
        },
    });

    // Extracting the 'Global Quote' data from the API response.
    const quoteData = response.data['Global Quote'];

    // Validating the 'Global Quote' data to ensure the stock symbol was found and data is available.
    if (!quoteData) {
        throw new Error('Stock symbol not found or data not available from API.');
    }

    // Parsing the price from the 'Global Quote' data and returning it as a floating-point number.
    return parseFloat(quoteData['05. price']);
}

// Exporting the fetchStockPrice function to allow it to be used in other parts of the application.
module.exports = { fetchStockPrice };
