import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, throwError } from 'rxjs';
import { SnackBarPopUpService } from '../snackBarPopUp/snack-bar-pop-up.service';

/*
-----------------------------------------------------------------------
Filename: stock-buy-sell.service.ts
Author: Cole Baxendale
Contact: thecodercole@gmail.com
Creation Date: February 2024
Version: 1.0

Description:
This service provides methods for buying and selling stocks by making HTTP requests to corresponding endpoints. It includes functionality to validate stock symbols and quantities, handle authentication errors, and display error messages using a snackbar service.

Dependencies:
- HttpClient: Angular's built-in HTTP client for making requests.
- SnackBarPopUpService: Service for displaying snackbar notifications.

Usage:
- Call the buyStock() method to buy stocks by providing symbol, quantity, and current price.
- Call the sellStock() method to sell stocks by providing symbol, quantity, and current price.
- Both methods handle validation of symbol and quantity, authentication errors, and display appropriate error messages.

Note: Ensure that the baseUrl variable points to the correct API endpoint.
-----------------------------------------------------------------------
*/

@Injectable({
  providedIn: 'root'
})
export class StockBuySellService {
  private baseUrl = 'http://localhost:3000/api/users';
  constructor(private http: HttpClient,private snackbarService: SnackBarPopUpService) { }
  

    // Method to buy stocks
    buyStock(requestBody: { symbol: string; quantity: number; currentPrice: number }): Observable<any> {
      // Validate stock symbol and quantity
      const symbol = requestBody.symbol;
      const quantity = requestBody.quantity;
      const symbolErrorMessage = this.validateStockSymbol(symbol);
      const quantityErrorMessage = this.isValidQuantity(quantity);
      // If there are validation errors, return an observable with an error message
      if (symbolErrorMessage !== null || quantityErrorMessage !== null) {
        const errorMessage = symbolErrorMessage || quantityErrorMessage || 'Unknown error message';
        return throwError(() => new Error(errorMessage));
      } else {
        // If validation passes, make HTTP POST request to buy-stock endpoint
        const authToken = this.getAuthorizationToken();
        const url = `${this.baseUrl}/buy-stock`;
        const headers = new HttpHeaders({
          Authorization: `Bearer ${authToken}`
        });
        return this.http.post<any>(url, requestBody, { headers }).pipe(
          catchError((error) => {
            const errorMessage = error.error.message; // Correct way to access the error message
            if(error.status === 403){
              // Handle authentication errors
              localStorage.setItem('snackbarMessage' , 'Success: ' + 'Account has been reset.')
              localStorage.removeItem('loginToken');
              window.location.reload();
              return EMPTY;
            } else {
              // Corrected to use `errorMessage` directly
              this.snackbarService.openSnackBar('Error: ' + errorMessage);
              return EMPTY;
            }
          })
        );
      }
    }
  
  // Method to sell stocks
  sellStock(requestBody: { symbol: string; quantity: number; currentPrice: number }): Observable<any> {
    // Validate stock symbol and quantity
    const symbol = requestBody.symbol;
    const quantity = requestBody.quantity;
    const symbolErrorMessage = this.validateStockSymbol(symbol);
    const quantityErrorMessage = this.isValidQuantity(quantity);
    // If there are validation errors, return an observable with an error message
    if (symbolErrorMessage !== null || quantityErrorMessage !== null) {
      const errorMessage = symbolErrorMessage || quantityErrorMessage || 'Unknown error message';
      this.snackbarService.openSnackBar('Error: ' + errorMessage);
      return EMPTY;
    } else {
      // If validation passes, make HTTP POST request to sell-stock endpoint
      const authToken = this.getAuthorizationToken();
      const url = `${this.baseUrl}/sell-stock`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${authToken}`
      });
      return this.http.post<any>(url, requestBody, { headers }).pipe(
        catchError((error) => {
          const errorMessage = error.error.message; // Correct way to access the error message
          if(error.status === 403){
            // Handle authentication errors
            localStorage.setItem('snackbarMessage' , 'Please log in again.')
            localStorage.removeItem('loginToken');
            window.location.reload();
            return EMPTY;
          } else {
            // Corrected to use `errorMessage` directly
            this.snackbarService.openSnackBar('Error: ' + errorMessage);
            return EMPTY;
          }
        })
      );
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
  
    // Method to validate quantity
    private isValidQuantity(quantity: number): string | null {
      if (!quantity || isNaN(quantity)) {
        return 'Quantity is required.';
      }
      if (quantity <= 0) {
        return 'Please enter a valid quantity greater than zero.'
      }
      if (quantity > 1000) {
        return 'Quantity exceeds maximum allowed';
      }
      return null;
    }

      // Method to get authorization token
  private getAuthorizationToken(): string | Observable<any> {
    const token = localStorage.getItem('loginToken');
    if (token !== null) {
      return token;
    }
    else {
      return throwError(() => new Error('Authentication error'));
    }
  }
}
