import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  constructor(private http: HttpClient) {}

  // Define methods for interacting with the portfolio data
  getOwnedStocks(): Observable<Stock[]> {
    // Implement logic to fetch owned stocks from your backend
    return this.http.get<Stock[]>('http://localhost:3000/api/portfolio/owned');
  }

  // Add more methods as needed
}

interface Stock {
  ticker: string;
  avgPrice: number;
  quantityOwned: number;
  // Add more stock-related properties as needed
}
