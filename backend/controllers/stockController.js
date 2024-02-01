/**
 * Stock Controller
 * 
 * Filename: stockController.js
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [January 2024]
 * Version: 1.0
 * 
 * Description: 
 * This module is responsible for handling all stock-related operations in the application. 
 * It interfaces with the Alpha Vantage API to fetch real-time stock data, including current prices, 
 * detailed stock information, and news related to specific stocks. The module offers functionality 
 * to search for stocks, view detailed stock information, and retrieve news articles, thereby 
 * providing users with comprehensive stock market insights.
 * 
 * 
 * Update History:
 * - [January 24, 2024]: [Initial setup]
 * 
 */

const axios = require('axios');

// Set up for accessing Alpha Vantage API
const baseUrl = 'https://www.alphavantage.co/query'; // Base URL for Alpha Vantage API
const apiKey = process.env.ALPHA_ADV_API; // API key for Alpha Vantage, stored in environment variable
const { fetchStockPrice } =      require('../fetchCurrentPrice/fetchPrice'); // Import function to fetch current stock price

// Function to search for the latest price of a given stock symbol
/**
 * Searches for the latest price of a specified stock symbol.
 * @param {Request} req - The express request object, containing the query with the stock symbol.
 * @param {Response} res - The express response object.
 */
exports.searchStock = async (req, res) => {
  try {
    const symbol = req.query.symbol; // Extract stock symbol from request query
    const currentPrice = await fetchStockPrice(symbol); // Fetch current price of the stock
    res.json({ currentPrice }); // Send the current price in response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the stock quote' });
  }
};

/**
 * Retrieves detailed information about a specific stock using its symbol.
 * @param {Request} req - The express request object, containing the query with the stock symbol or search keywords.
 * @param {Response} res - The express response object.
 */
exports.viewStockDetails = async (req, res) => {
  try {
    const symbol = req.query.symbol; // Extract stock symbol from request query
    const functionParam = 'GLOBAL_QUOTE'; // Alpha Vantage function parameter for global quote

    // Check if the request includes a 'search' query parameter
    if (req.query.search) {
      const keywords = req.query.search; // Extract keywords from 'search' query parameter

      // Perform a SYMBOL_SEARCH query to Alpha Vantage
      const searchResponse = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'SYMBOL_SEARCH',
          keywords: keywords,
          apikey: process.env.ALPHA_VANTAGE_API_KEY,
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

      // Extract relevant stock information from the response data
      const stockData = response.data['Global Quote'];
      const stockSymbol = stockData['01. symbol'];
      const currentPrice = parseFloat(stockData['05. price']).toFixed(2);
      const previousClosePrice = parseFloat(stockData['08. previous close']).toFixed(2);
      const openingPrice = parseFloat(stockData['02. open']).toFixed(2);
      const highPrice = parseFloat(stockData['03. high']).toFixed(2);
      const lowPrice = parseFloat(stockData['04. low']).toFixed(2);
      const volume = parseFloat(stockData['06. volume']);
      const changePercent = parseFloat(stockData['10. change percent']).toFixed(2);

      // Compile and send the stock information as JSON response
      const stockInfo = {
        symbol: stockSymbol,
        currentPrice,
        previousClosePrice,
        openingPrice,
        highPrice,
        lowPrice,
        volume,
        change_percentage: changePercent,
      };
      res.json(stockInfo);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching stock details or performing search' });
  }
};

/**
 * Retrieves news articles related to a specific stock symbol.
 * @param {Request} req - The express request object, containing the query with the stock symbol.
 * @param {Response} res - The express response object.
 */
exports.getStockNews = async (req, res) => {
  try {
    const symbol = req.query.symbol; // Extract stock symbol from request query
    const functionParam = 'NEWS_SENTIMENT'; // Alpha Vantage function parameter for news sentiment data

    // Make a request to Alpha Vantage to get news and sentiment data
    const response = await axios.get(baseUrl, {
      params: {
        function: functionParam,
        tickers: symbol,
        apikey: apiKey,
      },
    });

    // Extract and process the news articles from response data
    const newsData = response.data.feed || [];
    const filteredNewsData = newsData.filter(article => article.banner_image !== null);
    const limitedNewsData = filteredNewsData.slice(0, 5); // Limiting the number of articles to 5

    // Map the necessary details from each news article
    const newsArticles = limitedNewsData.map(article => ({
      title: article.title,
      url: article.url,
      bannerImage: article.banner_image,
      summary: article.summary
    }));

    // Send the processed news articles as JSON response
    res.json(newsArticles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching news data' });
  }
};


/**
 * Handles symbol search using Alpha Vantage API.
 * @param {Request} req - The express request object, containing the query with the keywords.
 * @param {Response} res - The express response object.
 */
exports.searchBar = async (req, res) => {
  const { keywords } = req.query;
  const apiUrl = `${baseUrl}?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${apiKey}`;

  try {
    const response = await axios.get(apiUrl, {
      headers: { 'User-Agent': 'axios' },
    });

    if (response.status !== 200) {
      console.error('Status:', response.status);
      res.status(response.status).json({ error: 'API Error' });
      return;
    }

    const data = response.data;
    const usStocks = data.bestMatches
      .filter(stock => stock['4. region'] === 'United States')
      .slice(0, 4); // Limit to the first 4 US stocks

    res.json({ bestMatches: usStocks });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
