import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-stock-page',
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.sass']
})
export class StockPageComponent implements OnInit, OnDestroy {
  stockData: any;
  stockNews: any[] = [];
  loadingStockData: boolean = false;
  private stopRefresh = new Subject();
  private intervalSubscription: any; 
  private currentSymbol: string | null = null; // Store the current symbol

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const symbol = params.get('symbol');
      if (symbol) {
        if (this.intervalSubscription) {
          this.intervalSubscription.unsubscribe();
        }
        this.currentSymbol = symbol; // Update the current symbol
        this.fetchStockData(symbol); // Fetch stock data immediately
        this.fetchStockNews(symbol); // Fetch news only once

        // Set up a new interval to refresh stock data every 10 seconds
        this.intervalSubscription = interval(10000)
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

  async fetchStockData(symbol: string): Promise<void> {
  this.loadingStockData = true;
  const token = localStorage.getItem('loginToken');
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  try {
    const data: any = await this.http.get(`http://localhost:3000/api/stocks/stock?symbol=${symbol}`, { headers }).toPromise();
    this.stockData = data;
    this.loadingStockData = false;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    this.loadingStockData = false;
  }
}

  private fetchStockNews(symbol: string): void {
    const token = localStorage.getItem('loginToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get(`http://localhost:3000/api/stocks/news?symbol=${symbol}`, { headers }).subscribe(
      (newsData: any) => {
        this.stockNews = newsData as any[];
      },
      (error) => {
        console.error('Error fetching stock news:', error);
      }
    );
  }
}
