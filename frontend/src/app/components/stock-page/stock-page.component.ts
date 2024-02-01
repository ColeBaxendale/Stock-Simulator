import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const symbol = this.route.snapshot.paramMap.get('symbol');
    if (symbol) {
      this.fetchStockData(symbol); // Fetch stock data immediately
      this.fetchStockNews(symbol); // Fetch news only once

      interval(1000).pipe(
        takeUntil(this.stopRefresh) // Stop the interval when the component is destroyed
      ).subscribe(() => {
        this.fetchStockData(symbol); // Refresh stock data every 10 seconds
      });
    }
  }

  ngOnDestroy(): void {
    this.stopRefresh.next(true);
    this.stopRefresh.complete();
  }

  fetchStockData(symbol: string): void {
    this.loadingStockData = true;
    const token = localStorage.getItem('loginToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get(`http://localhost:3000/api/stocks/stock?symbol=${symbol}`, { headers }).subscribe(
      (data: any) => {
        this.stockData = data;
        this.loadingStockData = false;
      },
      (error) => {
        console.error('Error fetching stock data:', error);
        this.loadingStockData = false;
      }
    );
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
