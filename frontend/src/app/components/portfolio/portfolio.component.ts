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

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { StockDetailDialogComponent } from '../stock-detail-dialog/stock-detail-dialog.component';
import { Router } from '@angular/router';
import { UserServiceService } from '../../services/userRouteService/user-service.service';
import { StockService } from '../../services/stockRouteService/stock-service.service';
import { from, interval, mergeMap } from 'rxjs';
import { StockSharedServiceService } from '../../services/currentStockService/stock-shared-service.service';
import { PorfolioProfitLoss } from '../../services/profitLossService/portfolio-profitloss.service';
import { StockBuySellService } from '../../services/buySellRouteService/stock-buy-sell.service';
import { CurrentPriceSymbolSharedServiceService } from '../../services/currentPriceSymbolSharedService/current-price-symbol-shared-service.service';
import { SnackBarPopUpService } from '../../services/snackBarPopUp/snack-bar-pop-up.service';

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
  currentViewedStockSymbol: string | null = null;



  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private userService: UserServiceService,
    private stockService: StockService,
    private profitLossService: PorfolioProfitLoss,
    private stockSharedService: StockSharedServiceService,
    private buySellStockService: StockBuySellService,
    private currentPriceSymbolSharedService: CurrentPriceSymbolSharedServiceService,
    private snackbarService: SnackBarPopUpService
  ) { }

  ngOnInit(): void {
    this.fetchPortfolioData(); // Initial fetch of portfolio data


    const portfolioUpdateInterval = interval(15000); 
    portfolioUpdateInterval.subscribe(() => {
      this.updateCurrentPricesForAllStocks();
    });
  }
  updateCurrentPricesForAllStocks(): void {
    let totalPortfolioValue = 0; // Initialize total portfolio value

    
    this.loading = true;
    this.profitLossService.setLoading(this.loading);
    from(this.stocks).pipe(
        mergeMap(stock => 
            this.stockService.searchStock(stock.ticker), 
            (outerValue, innerValue) => ({ stock: outerValue, data: innerValue }), 
            5 // Concurrency limit
        )
    ).subscribe({
        next: ({ stock, data }) => {
            // Assuming data.currentPrice is always defined for simplicity
            const oldPrice = stock.currentPrice ?? stock.averageBuyPrice; // Fallback to averageBuyPrice if currentPrice is not set
            stock.currentPrice = data.currentPrice;
            stock.profitLoss = (data.currentPrice - stock.averageBuyPrice) * stock.quantityOwned;

            // Accumulate total portfolio value and profit/loss
            totalPortfolioValue += data.currentPrice * stock.quantityOwned;
        },
        complete: () => {
            // Once all updates are completed, update the total profit/loss and total portfolio value
            this.profitLossService.updatetotalPortfolioValue(totalPortfolioValue);
            this.loading = false;
            this.profitLossService.setLoading(this.loading);
        },
        error: (error) => {
          this.snackbarService.openSnackBar('Error updating prices ' + error);
            this.loading = false;
            this.profitLossService.setLoading(this.loading);
        }
    });
}



  // Function to fetch portfolio data from the server
  fetchPortfolioData(): void {
    this.loading = true;
    this.profitLossService.setLoading(this.loading);
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
        this.stocks.forEach((stock) => {
          this.fetchCurrentPrices(stock, () => {
            fetchesCompleted++;
            // Check if all fetches are completed
            if (fetchesCompleted === stocksLength) {
              this.loading = false;
             this.profitLossService.setLoading(this.loading);

              this.calculateAndEmitTotalProfitLoss();
            }
          });
        });

        // In case there are no stocks, ensure loading is set to false
        if (stocksLength === 0) {
          this.loading = false;
          this.profitLossService.setLoading(this.loading);

          this.calculateAndEmitTotalProfitLoss();
        }
      },
      error: (error) => {
        this.snackbarService.openSnackBar('Error fetching portfolio data: ' + error);
        this.loading = false;
        this.profitLossService.setLoading(this.loading);

      }
    });
  }

  calculateAndEmitTotalProfitLoss() {
    let totalPortfolioValue = 0
    this.stocks.forEach(stock => {
      if(stock.currentPrice)
        totalPortfolioValue += stock.quantityOwned * stock.currentPrice;

      })
      
    this.profitLossService.updatetotalPortfolioValue(totalPortfolioValue)
  }

  fetchCurrentPrices(stock: Stock, callback: () => void): void {
    this.stockService.searchStock(stock.ticker).subscribe({
      next: (data) => {
        stock.currentPrice = data['currentPrice'];
        stock.profitLoss = (data['currentPrice'] - stock.averageBuyPrice) * stock.quantityOwned;
        callback(); // Indicate this fetch is completed
      },
      error: (error) => {
        this.snackbarService.openSnackBar(`Error fetching current prices for ${stock.ticker}: `+ error);
        callback(); // Ensure callback is called even in case of error
      }
    });
  }

  openStockDetailDialog(stockData: any): void {
    this.currentViewedStockSymbol = stockData.ticker; // Track the currently viewed stock
    this.currentPriceSymbolSharedService.updateCurrentStockDetails({
      symbol: stockData.ticker,
      currentPrice: stockData.currentPrice
    });
    this.stockSharedService.updateCurrentStockDetails({
      symbol: stockData.ticker,
      currentPrice: stockData.currentPrice,
      ownedShares: stockData.quantityOwned,
      averageBuyPrice: stockData.averageBuyPrice,
      profitLoss: stockData.profitLoss,
    });
  
    const dialogRef = this.dialog.open(StockDetailDialogComponent, {
      width: '250px',
      data: {
        symbol: stockData.ticker,
        // Additional properties...
        sellStock: (ticker: string, quantity: number, price: number) => this.sellStock(ticker, quantity, price) 
      }
    });
  
    dialogRef.afterClosed().subscribe(() => {
      this.currentViewedStockSymbol = null; // Clear the currently viewed stock when dialog is closed
      this.stockSharedService.clearCurrentStockDetails();
    });
  }

  // Function to sell stocks
  sellStock(stockSymbol: string, quantityOwned: number, currentPrice: number): void {
    const requestBody = {
      symbol: stockSymbol,
      quantity: quantityOwned,
      currentPrice: currentPrice
    };

    // Make the sellStock API call
    this.buySellStockService.sellStock(requestBody).subscribe({
      next: (response) => {
        localStorage.setItem('snackbarMessage' , 'Success: ' + response.message)
        window.location.reload();

      },
      error: (error) => {
        this.snackbarService.openSnackBar('Error selling stock: ' + error); // Log error if selling stock fails
      }
    });
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