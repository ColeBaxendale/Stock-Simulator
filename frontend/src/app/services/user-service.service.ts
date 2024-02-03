import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private baseUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }


  sellStock(stockSymbol: string, quantity: number): Observable<any> {
    const url = 'http://localhost:3000/api/users/sell-stock';
    const requestBody = { symbol: stockSymbol, quantity: quantity };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('loginToken')}`
    });

    return this.http.post<any>(url, requestBody, { headers });
  }

  buyStock(stockSymbol: string, quantity: number): Observable<any> {
    const url = 'http://localhost:3000/api/users/buy-stock';
    const requestBody = { symbol: stockSymbol, quantity: quantity };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('loginToken')}`
    });

    return this.http.post<any>(url, requestBody, { headers });
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



  private isValidQuantity(quantity: number): boolean {

    
  }

  private isValidStockSymbol(stockSymbol: string): boolean {
    // Implement your validation logic for stock symbols
    // Return true if valid, false otherwise
  }

  private isValidQuantity(quantity: number): boolean {
    // Implement your validation logic for quantity
    // Return true if valid, false otherwise
  }

  private getAuthorizationHeaders(): HttpHeaders {
    // Test 3: Validate user authorization token
    const token = localStorage.getItem('loginToken');
    if (!token) {
      return new HttpHeaders();
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}




/*
deposit
getUserPortfolio
getUserTransactions
resetUserAccount
getUserDetails
changeUserDetails
*/