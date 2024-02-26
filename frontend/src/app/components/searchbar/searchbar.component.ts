/*
-----------------------------------------------------------------------
Filename: searchbar.component.ts
Author: Cole Baxendale
Contact: thecodercole@gmail.com
Creation Date: February 2024
Version: 1.0

Description:
This component implements a search bar functionality for searching stocks. It provides two modes: navigate and select. In navigate mode, it navigates to the stock details page upon selecting a stock symbol. In select mode, it emits the selected stock symbol to the parent component.

Dependencies:
- Angular's core library for component functionality.
- Angular's router for navigation.
- RxJS library for handling asynchronous operations.
- StockService for searching stocks.
- SnackBarPopUpService for displaying snackbar notifications.

Usage:
- Include this component in the template where stock search functionality is required.
- Bind the mode input property to specify the component's mode ('navigate' or 'select').
- Handle the stockSelected event in the parent component when using 'select' mode.
- Implement the inputChanged event in the parent component to listen for input changes.
- Customize debounceTime value as needed for input debounce.
- Customize error handling and notifications as needed.
-----------------------------------------------------------------------
*/


import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap, filter, catchError } from 'rxjs/operators';
import { StockService } from '../../services/stockRouteService/stock-service.service';
import { SnackBarPopUpService } from '../../services/snackBarPopUp/snack-bar-pop-up.service';


@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.sass']
})
export class SearchbarComponent {
  @Input() mode: 'navigate' | 'select' = 'navigate'; // Allows specifying the component's mode
  @Output() stockSelected = new EventEmitter<string>(); // Emit the selected stock symbol in 'select' mode
  @Output() inputChanged = new EventEmitter<void>();

  keywords: string = '';
  searchResults: any[] = [];
  isLoading: boolean = false;
  searchPerformed: boolean = false;
  private searchTerms = new Subject<string>();

  constructor(private router: Router, private stockService: StockService, private snackbarService: SnackBarPopUpService) {
    this.searchTerms.pipe(
      debounceTime(500),
      filter(term => term.trim() !== ''),
      switchMap(term => this.searchStocks(term))
    ).subscribe(
      data => {
        this.searchResults = data.bestMatches;
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  private searchStocks(term: string) {
    this.isLoading = true;
    this.searchPerformed = true;
    return this.stockService.searchBar(term).pipe(
      catchError(error => {
        this.snackbarService.openSnackBar('Error in HTTP request: ' + error);
        this.isLoading = false;
        return of([]);
      }),
      filter(response => this.keywords === term)
    );
  }

onInputChange(): void {
  // Emit an event to notify about the input change
  this.inputChanged.emit(); // This line is added

  if (this.keywords.trim() === '') {
    // Existing logic remains unchanged
    this.isLoading = false;
    this.searchResults = [];
    this.searchPerformed = false;
    this.searchTerms.next(this.keywords);
  } else {
    // Existing logic remains unchanged
    this.keywords = this.keywords.toUpperCase();
    this.isLoading = true;
    this.searchTerms.next(this.keywords);
  }
}
  
  onStockSelect(stockSymbol: string): void {
    if (this.mode === 'navigate') {
      this.router.navigate(['/stock', stockSymbol]);
    } else {
      this.stockSelected.emit(stockSymbol);
    }
    this.keywords = '';
    this.searchResults = [];
    this.searchPerformed = false;
    this.isLoading = false;
  }

  onEnterPress(): void {
    if (this.keywords) {
      this.onStockSelect(this.keywords);
    }
  }
  
}
