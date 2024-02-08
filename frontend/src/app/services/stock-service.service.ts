/**
 * Stock Service
 * 
 * Filename: stock-service.service.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description:
 * This service provides methods for interacting with stock-related data from an API.
 * It includes methods for searching stocks by symbol, viewing stock details, fetching
 * stock news, and searching stocks by keywords.
 * 
 * Algorithm Strategy:
 * 1. Implement methods to interact with stock-related endpoints of the API.
 * 2. Utilize Angular's HttpClient module to make HTTP requests to the API.
 * 3. Validate input parameters before making API requests to ensure data integrity.
 * 4. Handle errors and edge cases gracefully to provide a smooth user experience.
 * 
 * Params:
 * - Injectable: Injectable - Angular decorator to mark the service as injectable.
 * - HttpClient: HttpClient - Angular HTTP client for making requests to the server.
 * - HttpHeaders: HttpHeaders - HTTP headers for setting request headers.
 * - Observable: Observable - RxJS observable for handling asynchronous data streams.
 */

// Import statements for Injectable, HttpClient, HttpHeaders, and Observable from Angular core modules
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

// Injectable decorator to provide the service at root level
@Injectable({
  providedIn: 'root'
})
export class StockService {
  // Base URL for API endpoints
  private baseUrl = 'http://localhost:3000/api/stocks';

  constructor(private http: HttpClient) { }

  // Method to search for stock by symbol
  searchStock(symbol: string): Observable<any> {
    // Convert symbol to uppercase
    symbol = symbol.toUpperCase();

    // Validate stock symbol
    const symbolErrorMessage = this.validateStockSymbol(symbol);
    if (symbolErrorMessage !== null) {
      const errorMessage = symbolErrorMessage || 'Unknown error message';
      return throwError(() => new Error(errorMessage));
    } else {
      // If validation passes, make HTTP GET request to search endpoint
      return this.http.get(`${this.baseUrl}/search?symbol=${symbol}`);
    }
  }
  
  // Method to view details of a stock by symbol
  viewStockDetails(symbol: string): Observable<any> {
    // Convert symbol to uppercase
    symbol = symbol.toUpperCase();

    // Validate stock symbol
    const symbolErrorMessage = this.validateStockSymbol(symbol);
    if (symbolErrorMessage !== null) {
      const errorMessage = symbolErrorMessage || 'Unknown error message';
      return throwError(() => new Error(errorMessage));
    } else {
      // If validation passes, make HTTP GET request to stock details endpoint
      return this.http.get(`${this.baseUrl}/stock?symbol=${symbol}`);
    }
  }

  // Method to fetch news related to a stock by symbol
  getStockNews(symbol: string): Observable<any> {
    // Convert symbol to uppercase
    symbol = symbol.toUpperCase();

    // Validate stock symbol
    const symbolErrorMessage = this.validateStockSymbol(symbol);
    if (symbolErrorMessage !== null) {
      const errorMessage = symbolErrorMessage || 'Unknown error message';
      return throwError(() => new Error(errorMessage));
    } else {
      // If validation passes, make HTTP GET request to news endpoint
      return this.http.get(`${this.baseUrl}/news?symbol=${symbol}`);
    }
  }

  // Method to search for stock by keywords
  searchBar(keywords: string): Observable<any> {
    // Convert keywords to uppercase
    keywords = keywords.toUpperCase();

    // Validate stock symbol
    const symbolErrorMessage = this.validateStockSymbol(keywords);
    if (symbolErrorMessage !== null) {
      const errorMessage = symbolErrorMessage || 'Unknown error message';
      return throwError(() => new Error(errorMessage));
    } else {
      // If validation passes, make HTTP GET request to searchbar endpoint
      return this.http.get(`${this.baseUrl}/searchbar`, { params: { keywords } });
    }
  }

  // Method to validate stock symbol
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
