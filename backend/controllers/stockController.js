/**
 * User Controller
 * 
 * Filename: userController.js
 * Author: Cole Baxendale
 * Contact: thecodercole@gmail.com
 * Created on: January 2024
 * Version: 1.0
 * 
 * Description: 
 * This module provides the core functionality for user management and stock transaction 
 * processing in the application. It includes methods for user registration, login, 
 * stock buying and selling, depositing funds, and fetching user portfolio and transaction 
 * history. The controller uses Mongoose for database operations and integrates with the 
 * Alpha Vantage API for real-time stock data. Each function is designed to handle specific 
 * API requests, ensuring robustness and reliability in user and stock data management.
 */

const axios = require('axios'); // Import axios for making HTTP requests

// Set up for accessing Alpha Vantage API
const baseUrl = 'https://www.alphavantage.co/query'; // Base URL for Alpha Vantage API
const apiKey = process.env.ALPHA_ADV_API; // API key for Alpha Vantage, stored in environment variable
const { fetchStockPrice } = require('../fetchCurrentPrice/fetchPrice'); // Import function to fetch current stock price

// Function to search for the latest price of a given stock symbol
/**
 * Searches for the latest price of a specified stock symbol.
 * Utilizes a custom function `fetchStockPrice` to asynchronously fetch the current stock price.
 * @param {Request} req - The express request object, containing the query with the stock symbol.
 * @param {Response} res - The express response object, used to send the response back to the client.
 */
exports.searchStock = async (req, res) => {
  try {
    const symbol = req.query.symbol; // Extract the stock symbol from the request query

    // Validate the symbol input
    if (!symbol || symbol === '') {
      return res.status(400).json({ message: 'Symbol is required' });
    }

    // Ensure the symbol length does not exceed a specific limit for validation
    if (symbol.length > 5) {
      return res.status(400).json({ message: 'Input length exceeds maximum allowed' });
    }
    symbol.toUpperCase(); // Convert symbol to uppercase to match API requirements

    const currentPrice = await fetchStockPrice(symbol); // Fetch the current price of the stock
    res.json({ currentPrice }); // Respond with the current price
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the stock quote' });
  }
};

/**
 * Retrieves detailed information about a specific stock using its symbol.
 * This function can also handle keyword search if a 'search' query is provided.
 * It either fetches detailed stock data or searches for stocks based on keywords.
 * @param {Request} req - The express request object, containing the query with the stock symbol or search keywords.
 * @param {Response} res - The express response object, used to send the response back to the client.
 */
exports.viewStockDetails = async (req, res) => {
  try {
    const symbol = req.query.symbol; // Extract stock symbol from request query

    // Validate the symbol input
    if (!symbol || symbol === '') {
      return res.status(400).json({ message: 'Symbol is required' });
    }

    // Ensure the symbol length does not exceed a specific limit for validation
    if (symbol.length > 5) {
      return res.status(400).json({ message: 'Input length exceeds maximum allowed' });
    }
    symbol.toUpperCase(); // Convert symbol to uppercase to match API requirements

    const functionParam = 'GLOBAL_QUOTE'; // Set the API function parameter for fetching stock details

    if (req.query.search) {
      // Handle search functionality if 'search' query is provided
      const keywords = req.query.search; // Extract keywords from 'search' query parameter

      // Perform a SYMBOL_SEARCH query to Alpha Vantage
      const searchResponse = await axios.get(`${baseUrl}`, {
        params: {
          function: 'SYMBOL_SEARCH',
          keywords: keywords,
          apikey: apiKey,
          datatype: 'json',
        },
      });

      const searchResults = searchResponse.data; // Extract search results from response
      res.json(searchResults); // Send search results in response
    } else {
      // Fetch stock details using the GLOBAL_QUOTE function
      const response = await axios.get(baseUrl, {
        params: {
          function: functionParam,
          symbol: symbol,
          apikey: apiKey,
        },
      });

      // Process and compile the stock information from the response
      const stockData = response.data['Global Quote'];
      const stockInfo = {
        symbol: stockData['01. symbol'],
        currentPrice: parseFloat(stockData['05. price']).toFixed(2),
        previousClosePrice: parseFloat(stockData['08. previous close']).toFixed(2),
        openingPrice: parseFloat(stockData['02. open']).toFixed(2),
        highPrice: parseFloat(stockData['03. high']).toFixed(2),
        lowPrice: parseFloat(stockData['04. low']).toFixed(2),
        volume: parseFloat(stockData['06. volume']),
        change_percentage: parseFloat(stockData['10. change percent']).toFixed(2),
      };
      res.json(stockInfo); // Send the compiled stock information in the response
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching stock details or performing search' });
  }
};

/**
 * Retrieves news articles related to a specific stock symbol.
 * It requests news sentiment data from the Alpha Vantage API using the 'NEWS_SENTIMENT' function.
 * The response is filtered and processed to return relevant news articles to the user.
 * @param {Request} req - The express request object, containing the query with the stock symbol.
 * @param {Response} res - The express response object, used to send the response back to the client.
 */
exports.getStockNews = async (req, res) => {
  try {
    const symbol = req.query.symbol; // Extract stock symbol from request query

    // Validate the symbol input
    if (!symbol || symbol === '') {
      return res.status(400).json({ message: 'Symbol is required' });
    }

    // Ensure the symbol length does not exceed a specific limit for validation
    if (symbol.length > 5) {
      return res.status(400).json({ message: 'Input length exceeds maximum allowed' });
    }
    symbol.toUpperCase(); // Convert symbol to uppercase to match API requirements

    const functionParam = 'NEWS_SENTIMENT'; // Set the API function parameter for fetching news sentiment data

    // Request news sentiment data from Alpha Vantage
    const response = await axios.get(baseUrl, {
      params: {
        function: functionParam,
        tickers: symbol,
        apikey: apiKey,
      },
    });

    // Process and filter the news articles from the response data
    const newsData = response.data.feed || [];
    const filteredNewsData = newsData.filter(article => article.banner_image !== null);
    const limitedNewsData = filteredNewsData.slice(0, 5); // Limit the number of articles to 5 for relevance

    // Map necessary details from each news article
    const newsArticles = limitedNewsData.map(article => ({
      title: article.title,
      url: article.url,
      bannerImage: article.banner_image,
      summary: article.summary
    }));

    // Send the processed news articles as JSON response
    res.json(newsArticles);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching news data' });
  }
};

/**
 * Handles symbol search using Alpha Vantage API.
 * This function facilitates search functionality for stock symbols based on provided keywords.
 * The search results are filtered to return only US stocks and are limited to the first 4 matches.
 * @param {Request} req - The express request object, containing the query with the keywords.
 * @param {Response} res - The express response object, used to send the response back to the client.
 */
exports.searchBar = async (req, res) => {
  const { keywords } = req.query; // Extract search keywords from request query

  // Validate the keywords input
  if (!keywords || keywords === '') {
    return res.status(400).json({ message: 'Symbol is required' });
  }

  // Ensure the keywords length does not exceed a specific limit for validation
  if (keywords.length > 5) {
    return res.status(400).json({ message: 'Input length exceeds maximum allowed' });
  }
  keywords.toUpperCase(); // Convert keywords to uppercase to match API requirements

  const apiUrl = `${baseUrl}?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${apiKey}`; // Construct API URL for search

  try {
    const response = await axios.get(apiUrl, {
      headers: { 'User-Agent': 'axios' },
    });

    if (response.status !== 200) {
      res.status(response.status).json({ error: 'API Error' });
      return;
    }

    // Filter and process the search results
    const data = response.data;
    const usStocks = data.bestMatches
      .filter(stock => stock['4. region'] === 'United States')
      .slice(0, 4); // Limit to the first 4 US stocks for relevance

    res.json({ bestMatches: usStocks }); // Send the filtered search results in the response
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
