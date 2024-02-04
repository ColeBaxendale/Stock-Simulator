import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, interval, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { StockService } from '../../services/stock-service.service';
import { UserServiceService } from '../../services/user-service.service';

@Component({
  selector: 'app-stock-page',
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.sass']
})
export class StockPageComponent implements OnInit, OnDestroy {
  stockData: any;
  stockNews: any[] = [];
  loadingStockData: boolean = false;
  loadingNewsData: boolean = false;
  private stopRefresh = new Subject();
  private intervalSubscription: any; 
  private currentSymbol: string | null = null; // Store the current symbol
  private currentPrice= 0.00
  private newsFetched: boolean = false; 
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private stockService: StockService, private userService: UserServiceService) { }

  ngOnInit(): void {
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
  ngOnDestroy(): void {
    this.stopRefresh.next(true);
    this.stopRefresh.complete();
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }
  buyStock(): void {
    if (this.currentSymbol) {
      console.log(`Buying stock with symbol: ${this.currentSymbol} for $${this.currentPrice}`);
      const requestBody = {
        symbol: this.currentSymbol,
        quantity: 1,
        currentPrice: this.currentPrice
      };
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
  
  async fetchStockData(symbol: string): Promise<void> {
    this.loadingStockData = true;
    try {
      const data: any = await firstValueFrom(this.stockService.viewStockDetails(symbol));
      this.stockData = data;
      this.currentPrice = data.currentPrice;
      this.loadingStockData = false;
    } catch (error) {
      console.error('Error fetching stock data:', error);
      this.loadingStockData = false;
    }
  }
  
  

  private async fetchStockNews(symbol: string): Promise<void> {
    this.loadingNewsData = true;
    const newsData: any = await firstValueFrom(this.stockService.getStockNews(symbol))
        this.stockNews = newsData as any[];
    this.loadingNewsData = false;
  }
}
