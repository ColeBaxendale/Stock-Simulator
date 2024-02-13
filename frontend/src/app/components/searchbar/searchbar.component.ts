/**
 * Searchbar Component
 * 
 * Filename: searchbar.component.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description: 
 * This component represents the search bar feature of the application. It allows users 
 * to search for stocks using keywords. The component sends HTTP requests to the server 
 * to fetch search results based on the entered keywords. It utilizes Angular Material 
 * for UI elements and interacts with the StockService for fetching search results.
 * 
 */

// Import necessary Angular modules and RxJS operators
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs'; // Import Subject and of from RxJS
import { debounceTime, switchMap, filter, catchError } from 'rxjs/operators'; // Import necessary operators from RxJS
import { StockService } from '../../services/stockRouteService/stock-service.service'; // Import the StockService

// Define the component decorator with its selector, template, and styles
@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.sass']
})
export class SearchbarComponent {

  keywords: string = ''; // Initialize keywords as an empty string
  searchResults: any[] = []; // Initialize searchResults as an empty array
  isLoading: boolean = false; // Initialize isLoading as false
  private searchTerms = new Subject<string>(); // Create a private subject for handling search terms
  searchPerformed: boolean = false; // Initialize searchPerformed as false

  // Constructor to inject dependencies and set up the search functionality
  constructor(private http: HttpClient, private router: Router, private stockService: StockService) {

    // Pipe the search terms through various RxJS operators
    this.searchTerms.pipe(
      debounceTime(500), // Debounce the search terms to avoid rapid input
      filter(term => term.trim() !== ''), // Filter out empty terms
      switchMap(term => this.searchStocks(term)) // Switch to a new observable for each term
    ).subscribe(
      (data: any) => {
        this.searchResults = data.bestMatches as any[]; // Set search results based on API response
        this.isLoading = false; // Set isLoading to false after receiving search results
      },
      (error) => {
        // Error handling
        this.isLoading = false; // Set isLoading to false in case of error
      }
    );
  }

  /**
   * Method to search for stocks based on the provided term
   * @param term The search term entered by the user
   * @returns An observable of the search results
   */
  private searchStocks(term: string) {

    this.isLoading = true; // Start loading
    this.searchPerformed = true; // Indicate that a search has been performed
    return this.stockService.searchBar(term).pipe(
      catchError(error => {
        console.error('Error in HTTP request', error); // Log the error
        this.isLoading = false; // Set isLoading to false in case of error
        return of([]); // Return an empty array or appropriate fallback value
      }),
      filter(response => this.keywords === term) // Filter out outdated results
    );
  }

  /**
   * Method to handle input change in the search bar
   */
  onInputChange() {
    if (this.keywords.trim() === '') {
      this.isLoading = false; // Stop loading if input is empty
      this.searchResults = []; // Clear search results
      this.searchPerformed = false; // Indicate that a search has not been performed
      this.searchTerms.next(this.keywords); // Emit an empty value to reset the search
    } else {
      this.keywords = this.keywords.toUpperCase(); // Convert keywords to uppercase
      this.isLoading = true; // Start loading only when there's a term to search
      this.searchTerms.next(this.keywords); // Emit the search term
    }
  }

  /**
   * Method to handle selection of a stock from search results
   * @param stockSymbol The symbol of the selected stock
   */
  onStockSelect(stockSymbol: string) {
    // Check if the selected stock symbol exists in the search results
    const stockExists = this.searchResults.some(stock => stock['1. symbol'] === stockSymbol);
  
    if (stockExists) {
      this.router.navigate(['/stock', stockSymbol]); // Navigate to the stock details page
      this.keywords = ''; // Clear the search keywords
      this.searchResults = []; // Clear the search results
      this.searchPerformed = false; // Reset searchPerformed flag
    } else {
      console.error('Stock does not exist'); // Log an error if the stock does not exist
    }
  }
  
  /**
   * Method to handle pressing the Enter key in the search bar
   */
  onEnterPress() {
    if (this.keywords) {
      this.onStockSelect(this.keywords); // Call onStockSelect method if keywords exist
    }
  }
}
