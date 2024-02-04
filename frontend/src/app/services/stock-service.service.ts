import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private baseUrl = 'http://localhost:3000/api/stocks';

  constructor(private http: HttpClient) { }



  searchStock(symbol: string): Observable<any> {
    symbol = symbol.toUpperCase();
    const symbolErrorMessage = this.validateStockSymbol(symbol);
    if (symbolErrorMessage !== null) {
      const errorMessage = symbolErrorMessage || 'Unknown error message';
      return throwError(() => new Error(errorMessage));
    } else {
      return this.http.get(`${this.baseUrl}/search?symbol=${symbol}`);
    }
  }
  
  viewStockDetails(symbol: string): Observable<any> {
    symbol = symbol.toUpperCase();
    console.log(symbol);
    
    const symbolErrorMessage = this.validateStockSymbol(symbol);
    if (symbolErrorMessage !== null) {
      const errorMessage = symbolErrorMessage || 'Unknown error message';
      return throwError(() => new Error(errorMessage));
    } else {
      return this.http.get(`${this.baseUrl}/stock?symbol=${symbol}`);
    }
  }

  
  getStockNews(symbol: string): Observable<any> {
    symbol = symbol.toUpperCase();
    const symbolErrorMessage = this.validateStockSymbol(symbol);
    if (symbolErrorMessage !== null) {
      const errorMessage = symbolErrorMessage || 'Unknown error message';
      return throwError(() => new Error(errorMessage));
    } else {
      return this.http.get(`${this.baseUrl}/news?symbol=${symbol}`);
    }
  }

  searchBar(keywords: string): Observable<any> {
    keywords = keywords.toUpperCase();
    const symbolErrorMessage = this.validateStockSymbol(keywords);
    if (symbolErrorMessage !== null) {
      const errorMessage = symbolErrorMessage || 'Unknown error message';
      return throwError(() => new Error(errorMessage));
    } else {
      return this.http.get(`${this.baseUrl}/searchbar`, { params: { keywords } });
    }
  }


  private validateStockSymbol(symbol: string): string | null {
    // Check if the symbol is missing or empty
    if (!symbol || symbol === '') {
      return 'Stock symbol is required.';
    }

    // Test for input length exceeding the maximum allowed
    if (symbol.length > 5) {
      return 'Stock symbol length should not exceed 5 characters.';
    }

    // If all checks pass, return null (no error)
    return null;
  }
}
