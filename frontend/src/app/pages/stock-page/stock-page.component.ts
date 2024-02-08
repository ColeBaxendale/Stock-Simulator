/**
 * Stock Page Component
 * 
 * Filename: stock-page.component.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description: 
 * This component represents the stock page of the application. It retrieves and displays
 * stock data and news for a specific stock symbol. It provides functionality to refresh
 * the data periodically, as well as to buy stocks.
 * 
 * Algorithm Strategy:
 * 1. Initialize the component and its properties.
 * 2. Subscribe to route parameter changes to retrieve the current stock symbol.
 * 3. Fetch stock data and news when the component initializes, and set up interval to periodically refresh data.
 * 4. Implement methods to handle buying stocks and fetching stock data/news from the backend.
 * 5. Utilize Angular's HttpClient to make HTTP requests to the backend services.
 * 6. Implement ngOnDestroy lifecycle hook to clean up resources and prevent memory leaks.
 * 
 * Params:
 * - HttpClient: HttpClient - Angular HTTP client for making requests to the server.
 * - ActivatedRoute: ActivatedRoute - Angular service for accessing route parameters.
 * - Router: Router - Angular router for navigation.
 * - StockService: StockService - Service for fetching stock data and news.
 * - UserServiceService: UserServiceService - Service for user-related operations.
 */

// Import necessary modules
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, interval, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { StockService } from '../../services/stock-service.service';
import { UserServiceService } from '../../services/user-service.service';

// Component decorator and class definition
@Component({
  selector: 'app-stock-page',
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.sass']
})
export class StockPageComponent implements OnInit, OnDestroy {
  stockData: any; // Variable to hold stock data
  stockNews: any[] = []; // Array to store stock news
  loadingStockData: boolean = false; // Flag to indicate loading of stock data
  loadingNewsData: boolean = false; // Flag to indicate loading of news data
  private stopRefresh = new Subject(); // Subject to signal stopping refresh
  private intervalSubscription: any; // Subscription for interval
  private currentSymbol: string | null = null; // Store the current symbol
  private currentPrice= 0.00 // Store the current price
  private newsFetched: boolean = false; // Flag to track whether news has been fetched

  // Constructor to inject dependencies
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private stockService: StockService,
    private userService: UserServiceService
  ) { }

  // Lifecycle hook - ngOnInit
  ngOnInit(): void {
    // Subscribe to route parameter changes
    this.route.paramMap.subscribe((params) => {
      const symbol = params.get('symbol');
      if (symbol) {
        if (this.intervalSubscription) {
          this.intervalSubscription.unsubscribe();
        }
        this.currentSymbol = symbol; // Update the current symbol
        this.fetchStockData(symbol); // Fetch stock data immediately

        // Check if news has already been fetched
        if (!this.newsFetched) {
          this.fetchStockNews(symbol); // Fetch news only once
          this.newsFetched = true; // Set the flag to true after fetching news
        }

        // Set up a new interval to refresh stock data every 10 seconds
        this.intervalSubscription = interval(100000)
          .pipe(
            takeUntil(this.stopRefresh),
            switchMap(() => this.fetchStockData(this.currentSymbol!))
          )
          .subscribe(() => {});
      }
    });
  }

  // Lifecycle hook - ngOnDestroy
  ngOnDestroy(): void {
    this.stopRefresh.next(true); // Emit signal to stop refreshing
    this.stopRefresh.complete(); // Complete the subject
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe(); // Unsubscribe from interval
    }
  }

  // Method to handle buying stocks
  buyStock(): void {
    if (this.currentSymbol) {
      console.log(`Buying stock with symbol: ${this.currentSymbol} for $${this.currentPrice}`);
      const requestBody = {
        symbol: this.currentSymbol,
        quantity: 1,
        currentPrice: this.currentPrice
      };
      // Call the buyStock method from the user service
      this.userService.buyStock(requestBody).subscribe({
        next: (response) => {
          console.log('Response:', response.message);
          alert('Success: ' + response.message);
          this.ngOnInit(); // Refresh the portfolio after selling
        },
        error: (error) => {
          console.error('Error buying stock:', error);
        }
      });
    }
  }
  
  // Method to fetch stock data
  private async fetchStockData(symbol: string): Promise<void> {
    this.loadingStockData = true; // Set loading flag to true
    try {
      const data: any = await firstValueFrom(this.stockService.viewStockDetails(symbol)); // Fetch stock data
      this.stockData = data; // Assign fetched data to stockData variable
      this.currentPrice = data.currentPrice; // Update the current price
      this.loadingStockData = false; // Set loading flag to false
    } catch (error) {
      console.error('Error fetching stock data:', error); // Log error if fetching fails
      this.loadingStockData = false; // Set loading flag to false
    }
  }

  // Method to fetch stock news
  private async fetchStockNews(symbol: string): Promise<void> {
    this.loadingNewsData = true; // Set loading flag to true
    const newsData: any = await firstValueFrom(this.stockService.getStockNews(symbol)); // Fetch stock news
    this.stockNews = newsData as any[]; // Assign fetched data to stockNews array
    this.loadingNewsData = false; // Set loading flag to false
  }
}
