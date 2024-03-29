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
import { StockService } from '../../services/stockRouteService/stock-service.service';
import { UserServiceService } from '../../services/userRouteService/user-service.service';
import { StockBuySellService } from '../../services/buySellRouteService/stock-buy-sell.service';
import { BuyStockDialogStockPageComponent } from '../../components/buy-stock-dialog-stock-page/buy-stock-dialog-stock-page.component';
import { MatDialog } from '@angular/material/dialog';
import { CurrentPriceSymbolSharedServiceService } from '../../services/currentPriceSymbolSharedService/current-price-symbol-shared-service.service';
import { SnackBarPopUpService } from '../../services/snackBarPopUp/snack-bar-pop-up.service';
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
    private userService: UserServiceService,
    private buySellStockService: StockBuySellService,
    private dialog: MatDialog,
    private currentPriceSymbolSharedService: CurrentPriceSymbolSharedServiceService,
    private snackbarService: SnackBarPopUpService
  ) { }

  ngOnInit(): void {
    // Subscribe to route parameter changes
    this.route.paramMap.subscribe((params) => {
        const symbol = params.get('symbol');
        if (symbol && this.currentSymbol !== symbol) {
            this.currentSymbol = symbol; // Update the current symbol
            this.fetchStockData(symbol); // Fetch stock data immediately
            this.fetchStockNews(symbol); // Always fetch news when the symbol changes

            // If there's an existing interval subscription, unsubscribe first
            if (this.intervalSubscription) {
                this.intervalSubscription.unsubscribe();
            }

            // Set up a new interval to refresh stock data every 10 seconds
            this.setupDataRefreshInterval();
        }
    });
}

private setupDataRefreshInterval(): void {
  this.intervalSubscription = interval(10000) // Adjusted to 10 seconds as seems to be the original intent
      .pipe(
          takeUntil(this.stopRefresh),
          switchMap(() => this.fetchStockData(this.currentSymbol!))
      )
      .subscribe({
          // You can also handle errors or responses here if needed
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
  buyStock(symbol: string, currentPrice: number): void {
    const dialogRef = this.dialog.open(BuyStockDialogStockPageComponent, {
      width: '400px',
      data: { symbol: symbol, currentPrice: currentPrice }
    });
    

  }
  
  // Method to fetch stock data
  private async fetchStockData(symbol: string): Promise<void> {
    this.loadingStockData = true; // Set loading flag to true
    try {
      const data: any = await firstValueFrom(this.stockService.viewStockDetails(symbol)); // Fetch stock data
      this.stockData = data; // Assign fetched data to stockData variable
      this.currentPrice = data.currentPrice; // Update the current price
      this.loadingStockData = false; // Set loading flag to false
  
      // Update shared service with the current stock details
      this.currentPriceSymbolSharedService.updateCurrentStockDetails({
        symbol: symbol,
        currentPrice: this.currentPrice 
      });
    } catch (error) {
      this.snackbarService.openSnackBar('Error fetching stock data: '+ error); // Log error if fetching fails
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

  
  backToDashboard(){
    this.router.navigateByUrl('/dashboard');
  }
}
