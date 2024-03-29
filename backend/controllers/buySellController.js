/**
 * Buy and Sell Controller
 * 
 * Filename: buySellController.js
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [January 2024]
 * Version: 1.0
 * 
 * Description: 
 * The buySellController module manages the core functionalities of stock transactions in the application. 
 * It includes functions to handle buying and selling of stocks by the users, updating their portfolio, 
 * and recording these transactions. The module works in tandem with the User model to ensure accurate 
 * tracking of user portfolios and buying power, thereby facilitating a seamless trading experience.
 * 
 * 
 */

const User = require('../models/user');

/**
 * Buy stocks and update the user's portfolio.
 * Time Complexity: O(1)
 * 
 * @param {User} user - The user object.
 * @param {string} symbol - The symbol of the stock to buy.
 * @param {number} quantity - The quantity of stocks to buy.
 * @param {number} stockPrice - The price of the stock.
 * @returns {string|null} - Error message if unable to buy stocks, otherwise null.
 */
async function buyStockPortfolio(user, symbol, quantity, stockPrice) {
    const totalCost = stockPrice * quantity;
    if (user.buyingPower < totalCost) {
        return 'Insufficient buying power to complete the transaction.';
    }
    const existingStock = user.portfolio.get(symbol);
    if (existingStock) {
        // Calculate new average buy price and quantity
        const totalQuantity = Number(existingStock.quantityOwned) + Number(quantity);
        const newAverageBuyPrice = ((existingStock.averageBuyPrice * existingStock.quantityOwned) + (stockPrice * quantity)) / totalQuantity;

        // Update the existing stock in the portfolio
        user.portfolio.set(symbol, {
            quantityOwned: totalQuantity,
            averageBuyPrice: newAverageBuyPrice
        });
        user.buyingPower -= totalCost;
    } else {
        // Add the new stock to the portfolio
        user.portfolio.set(symbol, {
            quantityOwned: quantity,
            averageBuyPrice: stockPrice
        });
        user.buyingPower -= totalCost;
        return null;
    }
}

/**
 * Sell stocks from the user's portfolio.
 * Time Complexity: O(1)
 * 
 * @param {User} user - The user object.
 * @param {string} symbol - The symbol of the stock to sell.
 * @param {number} quantity - The quantity of stocks to sell.
 * @param {number} stockPrice - The price of the stock.
 * @returns {string|null} - Error message if unable to sell stocks, otherwise null.
 */
async function sellStockPortfolio(user, symbol, quantity, stockPrice) {
    const existingStock = user.portfolio.get(symbol);
    if (!existingStock) 
        return`You do not own any ${symbol}.`
    if(existingStock.quantityOwned < quantity)
        return`You only own ${existingStock.quantityOwned} of ${symbol} you cannot sell more than that.`;
    const totalSalePrice = quantity * stockPrice;
    const newQuantity = Number(existingStock.quantityOwned) - Number(quantity);
    if(newQuantity === 0){
        user.portfolio.delete(symbol)
    }
    else{
        user.portfolio.set(symbol, {
            quantityOwned: newQuantity,
            averageBuyPrice: existingStock.averageBuyPrice
            });
        user.buyingPower += totalSalePrice;
        return null;
    }
    user.buyingPower += totalSalePrice;
    
}

/**
 * Add a transaction to the user's transaction history.
 * Time Complexity: O(1)
 * 
 * @param {User} user - The user object.
 * @param {string} buyOrSell - The type of transaction (buy or sell).
 * @param {string} symbol - The symbol of the stock.
 * @param {number} quantity - The quantity of stocks involved in the transaction.
 * @param {number} stockPrice - The price of the stock.
 */
async function addTransaction(user, buyOrSell, symbol, quantity, stockPrice) {
    // Create a timestamp with the current date and time
    const timestamp = new Date();
    const numberQuantity = Number(quantity)
    // Add the new transaction to the user's transactions array
    user.transactions.push({
        transactionType: buyOrSell,
        symbol,
        quantity: numberQuantity,
        price: stockPrice,
        totalPrice: stockPrice * quantity,
        timestamp: timestamp // Set the timestamp to the current time
    });
}


module.exports = { buyStockPortfolio, addTransaction, sellStockPortfolio };
