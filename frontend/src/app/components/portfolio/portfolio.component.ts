/**
 * Portfolio Component
 * 
 * Filename: portfolio.component.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description: 
 * This component represents the portfolio page of the application. It displays the user's 
 * portfolio, including the stocks they own, the quantity of each stock, the average buy price, 
 * the current price, and the profit/loss. The component fetches portfolio data from the server 
 * using HTTP requests to the UserService and StockService. It also provides functionality for 
 * selling stocks and viewing stock details through a dialog. The component uses Angular Material 
 * for UI elements and RxJS for handling asynchronous operations.
 * 
 * Params: None
 * Time Complexity: O(n)
 * Algorithm Strategy: The component fetches portfolio data asynchronously from the server 
 * and updates the UI with the fetched data. It then sets up an interval to fetch updated 
 * portfolio data periodically. When selling stocks, it makes HTTP requests to the UserService 
 * and StockService to update the user's portfolio and trigger necessary actions on the server. 
 * The algorithm ensures efficient handling of portfolio data and provides a responsive user 
 * experience.
 * 
 */

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { StockDetailDialogComponent } from '../stock-detail-dialog/stock-detail-dialog.component';
import { Router } from '@angular/router';
import { UserServiceService } from '../../services/user-service.service';
import { StockService } from '../../services/stock-service.service';
import { interval } from 'rxjs';

// Define the structure of a Stock object
interface Stock {
  ticker: string;
  quantityOwned: number;
  averageBuyPrice: number;
  currentPrice?: number; 
  profitLoss?: number;
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.sass']
})
export class PortfolioComponent implements OnInit {
  loading: boolean = true; // Flag to indicate loading state
  stocks: Stock[] = []; // Array to hold portfolio stocks
  sellQuantity: number = 1; // Quantity for selling stocks
  sortDirection: { [key: string]: string } = {};

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private userService: UserServiceService,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.fetchPortfolioData(); // Initial fetch of portfolio data

    // Set up interval to fetch portfolio data every 10 seconds
    const portfolioUpdateInterval = interval(10000); // 10 seconds
    portfolioUpdateInterval.subscribe(() => {
      this.fetchPortfolioData();
      
    });
  }

  // Function to fetch portfolio data from the server
  fetchPortfolioData(): void {
    this.loading = true;
    const token = localStorage.getItem('loginToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    this.http.get<{ portfolio: { [ticker: string]: Omit<Stock, 'ticker'> } }>(this.userService.getUserPortfolio(), { headers }).subscribe({
      next: (data) => {
        this.stocks = Object.entries(data.portfolio).map(([ticker, details]) => ({
          ticker,
          ...details,
          currentPrice: undefined,
          profitLoss: undefined,
        }));
  
        // Use a counter to track completion of all fetches
        let fetchesCompleted = 0;
        const stocksLength = this.stocks.length;
  
        // Now fetch current prices for each stock
        this.stocks.forEach((stock, index) => {
          this.fetchCurrentPrices(stock, () => {
            fetchesCompleted++;
            // Check if all fetches are completed
            if (fetchesCompleted === stocksLength) {
              this.loading = false;
            }
          });
        });
  
        // In case there are no stocks, ensure loading is set to false
        if (stocksLength === 0) {
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error fetching portfolio data:', error);
        this.loading = false;
      }
    });
  }
  
  fetchCurrentPrices(stock: Stock, callback: () => void): void {
    this.stockService.searchStock(stock.ticker).subscribe({
      next: (data) => {
        stock.currentPrice = data['currentPrice'];
        stock.profitLoss = (data['currentPrice'] - stock.averageBuyPrice) * stock.quantityOwned;
        callback(); // Indicate this fetch is completed
      },
      error: (error) => {
        console.error(`Error fetching current prices for ${stock.ticker}`, error);
        callback(); // Ensure callback is called even in case of error
      }
    });
  }
  
  // Function to open dialog for viewing stock details
  openDialog(stockData: any): void {
    const dialogRef = this.dialog.open(StockDetailDialogComponent, {
      width: '250px',
      data: {
        ...stockData,
        symbol: stockData.ticker,
        currentPrice: stockData.currentPrice, // Pass the current price
        profitLoss: stockData.profitLoss, // Pass the profit/loss
        sellStock: (ticker: string, quantityOwned: number) => this.sellStock(ticker, quantityOwned)
      }
    });
}
  
  // Function to sell stocks
  sellStock(stockSymbol: string, quantityOwned: number): void {
    this.stockService.searchStock(stockSymbol).subscribe(
      (stockData) => {
        const currentPrice = stockData?.currentPrice; // Get current price from API response
        if (currentPrice !== undefined) {
          const requestBody = {
            symbol: stockSymbol,
            quantity: quantityOwned,
            currentPrice: currentPrice
          };
  
          // Make the sellStock API call
          this.userService.sellStock(requestBody).subscribe({
            next: (response) => {
              console.log('Response:', response.message); // Log success message
              alert('Success: ' + response.message); // Show success message
              this.ngOnInit(); // Refresh the portfolio after selling
            },
            error: (error) => {
              console.error('Error selling stock:', error); // Log error if selling stock fails
            }
          });
        } else {
          console.error(`Error fetching current price for ${stockSymbol}`); // Log error if fetching current price fails
        }
      }
    );
}

toggleSortDirection(column: keyof Stock) {
  if (this.isValidColumn(column)) {
    const validColumn = column as keyof Stock; // Type assertion
    this.sortDirection[validColumn] = this.sortDirection[validColumn] === 'asc' ? 'desc' : 'asc';
    // Sort stocks based on the selected column and direction
    this.stocks.sort((a, b) => {
      const direction = this.sortDirection[validColumn] === 'asc' ? 1 : -1;
      // Use bracket notation to access properties dynamically
      // Make sure to handle the case where a[validColumn] or b[validColumn] is undefined
      return (a[validColumn] ?? '') > (b[validColumn] ?? '') ? direction : -direction;
    });
  }
}

isValidColumn(column: keyof Stock): column is keyof Stock {
  // Check if the column is a valid key of the Stock interface
  return column in this.stocks[0]; // Assuming stocks is not empty
}

}