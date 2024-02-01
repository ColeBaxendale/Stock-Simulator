import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, of, throwError } from 'rxjs';
import { debounceTime, switchMap, filter, catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.sass']
})
export class SearchbarComponent {

  keywords: string = '';
  searchResults: any[] = [];
  isLoading: boolean = false;
  private searchTerms = new Subject<string>();
  searchPerformed: boolean = false;
  constructor(private http: HttpClient, private router: Router) {

    this.searchTerms.pipe(
      debounceTime(500),
      filter(term => term.trim() !== ''),
      switchMap(term => this.searchStocks(term))
    ).subscribe(
      (data: any) => {
        this.searchResults = data.bestMatches as any[];
        this.isLoading = false;
        
      },
      (error) => {
        // Error handling
        this.isLoading = false;
      }
    );
  }

  private searchStocks(term: string) {

    this.isLoading = true; // Start loading
    this.searchPerformed = true;
    return this.http.get(`http://localhost:3000/api/stocks/searchbar?keywords=${term}`).pipe(
      catchError(error => {
        console.error('Error in HTTP request', error);
        this.isLoading = false; // Set loading to false in case of error
        return of([]); // Return an empty array or appropriate fallback value
      }),
      // Use filter instead of tap to ignore outdated results
      filter(response => this.keywords === term),
    );
  }

  onInputChange() {
    if (this.keywords.trim() === '') {
      this.isLoading = false; // Stop loading as there is no need to make a request
      this.searchResults = []; // Clear any previous results
      this.searchPerformed = false; // Indicate that a search has not been performed
      this.searchTerms.next(this.keywords); // Emit an empty value to reset the search
    } else {
      this.keywords = this.keywords.toUpperCase();
      this.isLoading = true; // Start loading only when there's a term to search
      this.searchTerms.next(this.keywords);
    }
  
  }

  onStockSelect(stockSymbol: string) {
    // Check if the stock symbol exists in the searchResults
    const stockExists = this.searchResults.some(stock => stock['1. symbol'] === stockSymbol);
  
    if (stockExists) {
      this.router.navigate(['/stock', stockSymbol]); // Navigate if the stock exists
      this.keywords = '';
      this.searchResults = [];
      this.searchPerformed = false;
    } else {
      // Handle the case where the stock does not exist
      // You might want to show an error message to the user
      console.error('Stock does not exist');
    }
  }
  
  // Method to handle the Enter key in the search bar
  onEnterPress() {
    if (this.keywords) {
      this.onStockSelect(this.keywords);
    }
  }
}
