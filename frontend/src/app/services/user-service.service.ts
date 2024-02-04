import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserServiceService {
  private baseUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    const usernameErrorMessage = this.validateUsername(userData.username);
    const emailErrorMessage = this.validateEmail(userData.email);
    const passwordErrorMessage = this.validatePassword(userData.password);
    if (usernameErrorMessage !== null || emailErrorMessage !== null || passwordErrorMessage !== null) {
      const errorMessage = usernameErrorMessage || emailErrorMessage || passwordErrorMessage || 'Unknown error message';
      return throwError(() => new Error(errorMessage));
    } else {
      return this.http.post(`${this.baseUrl}/register`, userData);
    }
  }

  login(credentials: any): Observable<any> {
    const emailErrorMessage = this.validateEmail(credentials.email);
    const passwordErrorMessage = this.validatePassword(credentials.password);
    if (emailErrorMessage !== null || passwordErrorMessage !== null) {
      const errorMessage = emailErrorMessage || passwordErrorMessage || 'Unknown error message';
      return throwError(() => new Error(errorMessage));
    } else {
      return this.http.post(`${this.baseUrl}/login`, credentials);
    }
  }

  buyStock(symbol: string, quantity: number): Observable<any> {
    const symbolErrorMessage = this.validateStockSymbol(symbol);
    const quantityErrorMessage = this.isValidQuantity(quantity);
    if (symbolErrorMessage !== null || quantityErrorMessage !== null) {
      const errorMessage = symbolErrorMessage || quantityErrorMessage || 'Unknown error message';
      return throwError(() => new Error(errorMessage));
    } else {
      const authToken = this.getAuthorizationToken();
      const url = `${this.baseUrl}/buy-stock`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${authToken}`
      });
      const requestBody = { symbol: symbol, quantity: quantity };
      return this.http.post<any>(url, requestBody, { headers }).pipe(
        catchError((error) => {
          // Handle the authentication error here (e.g., show an error message or redirect to login)
          console.error('Authentication error:', error);
          alert("Please log in again.");
          localStorage.removeItem('loginToken');
          window.location.reload();

          // You can return an observable with an error message here if needed
          return throwError(() => new Error('Authentication error'));
        })
      );
    }
  }

  sellStock(requestBody: { symbol: string; quantity: number; currentPrice: number }): Observable<any> {
    const symbol = requestBody.symbol
    const quantity = requestBody.quantity
    const currentPrice = requestBody
    console.log(symbol, quantity, currentPrice);
    
    const symbolErrorMessage = this.validateStockSymbol(symbol);
    const quantityErrorMessage = this.isValidQuantity(quantity);
    if (symbolErrorMessage !== null || quantityErrorMessage !== null) {
      const errorMessage = symbolErrorMessage || quantityErrorMessage || 'Unknown error message';
      return throwError(() => new Error(errorMessage));
    } else {
      const authToken = this.getAuthorizationToken();
      const url = `${this.baseUrl}/sell-stock`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${authToken}`
      });
      return this.http.post<any>(url, requestBody, { headers }).pipe(
        catchError((error) => {
          console.error('Error:', error);
          if (error.status === 400) {
            const errorMessage = error.error?.message || 'Bad Request';
            alert(errorMessage)
            return throwError(() => new Error(errorMessage));
          } else {
            console.error('Authentication error:', error);
            alert('Please log in again.');
            localStorage.removeItem('loginToken');
            window.location.reload();
  
            // You can return an observable with an error message here if needed
            return throwError(() => new Error('Authentication error'));
          }
        })
      );
    }
  }

  deposit(amount: number): Observable<any> {
    const depositErrorMessage = this.depositValidation(amount);
    if (depositErrorMessage !== null) {
      return throwError(() => new Error(depositErrorMessage));
    } else {
      const authToken = this.getAuthorizationToken();
      const url = `${this.baseUrl}/deposit`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${authToken}`
      });
      const requestBody = { amount: amount };
      return this.http.post<any>(url, requestBody, { headers }).pipe(
        catchError((error) => {
          // Handle the authentication error here (e.g., show an error message or redirect to login)
          console.error('Authentication error:', error);
          alert("Please log in again.");
          localStorage.removeItem('loginToken');
          window.location.reload();

          // You can return an observable with an error message here if needed
          return throwError(() => new Error('Authentication error'));
        })
      );
    }
  }

  getUserPortfolio(): string {
   return 'http://localhost:3000/api/users/portfolio';
  }

  getUserTransactions(): Observable<any> {
    const authToken = this.getAuthorizationToken();
    const url = `${this.baseUrl}/transaction-history`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });
    return this.http.get<any>(url, { headers }).pipe(
      catchError((error) => {
        // Handle the authentication error here (e.g., show an error message or redirect to login)
        console.error('Authentication error:', error);
        alert("Please log in again.");
        localStorage.removeItem('loginToken');
        window.location.reload();

        // You can return an observable with an error message here if needed
        return throwError(() => new Error('Authentication error'));
      })
    );
  }

  resetUserAccount(): Observable<any> {
    const authToken = this.getAuthorizationToken();
    const url = `${this.baseUrl}/reset-account`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });
    return this.http.get<any>(url, { headers }).pipe(
      catchError((error) => {
        // Handle the authentication error here (e.g., show an error message or redirect to login)
        console.error('Authentication error:', error);
        alert("Please log in again.");
        localStorage.removeItem('loginToken');
        window.location.reload();

        // You can return an observable with an error message here if needed
        return throwError(() => new Error('Authentication error'));
      })
    );
  }

  getUserDetails(): Observable<any> {
    const authToken = this.getAuthorizationToken();
    const url = `${this.baseUrl}/user-details`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}` // Use the method to get the token
    });
    return this.http.get<any>(url, { headers }).pipe(
      catchError((error) => {
        // Handle the authentication error here (e.g., show an error message or redirect to login)
        console.error('Authentication error:', error);
        alert("Please log in again.");
        localStorage.removeItem('loginToken');
        window.location.reload();

        // You can return an observable with an error message here if needed
        return throwError(() => new Error('Authentication error'));
      })
    );
  }

  changeUserDetails(username: string, email: string): Observable<any> {
    const usernameErrorMessage = this.validateUsername(username);
    const emailErrorMessage = this.validateEmail(email);
    if (usernameErrorMessage !== null || emailErrorMessage !== null) {
      const errorMessage = usernameErrorMessage || emailErrorMessage || 'Unknown error message';
      return throwError(() => new Error(errorMessage));
    } else {
      const authToken = this.getAuthorizationToken();
      const url = `${this.baseUrl}/change-user-details`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${authToken}` // Use the method to get the token
      });
      const requestBody = { username: username, email: email };
      return this.http.post<any>(url, requestBody, { headers }).pipe(
        catchError((error) => {
          // Handle the authentication error here (e.g., show an error message or redirect to login)
          console.error('Authentication error:', error);
          alert("Please log in again.");
          localStorage.removeItem('loginToken');
          window.location.reload();

          // You can return an observable with an error message here if needed
          return throwError(() => new Error('Authentication error'));
        })
      );
    }
  }

  // Validating methods
  private validateUsername(username: string): string | null {
    // Check if the Username is missing or empty
    if (!username || username === '') {
      return 'Username is required.';
    }
    // Test for input length exceeding the maximum allowed
    if (username.length > 50) {
      return 'Username length exceeds maximum allowed';
    }
    // Test for input length not exceeding the minimum allowed
    if (username.length < 4) {
      return 'Username must be more than 4 characters';
    }
    // If all checks pass, return null (no error)
    return null;
  }

  private validateEmail(email: string): string | null {
    // Check if the Email is missing or empty
    if (!email || email === '') {
      return 'Email is required.';
    }
    // Test for input length exceeding the maximum allowed
    if (email.length > 100) {
      return 'Email length exceeds maximum allowed';
    }
    // Check for valid email format using a regular expression
    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;;
    if (!emailRegex.test(email)) {
      return 'Invalid email format';
    }
    // If all checks pass, return null (no error)
    return null;
  }

  private validatePassword(password: string): string | null {
    // Check if the Password is missing or empty
    if (!password || password === '') {
      return 'Password is required.';
    }
    // Test for input length exceeding the maximum allowed
    if (password.length > 100) {
      return 'Password length exceeds maximum allowed';
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return 'Password must be at least 8 characters with a mix of letters, numbers, and symbols';
    }
    // If all checks pass, return null (no error)
    return null;
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

  private depositValidation(amount: number): string | null {
    if (amount || isNaN(amount)) {
      return 'Quantity is required.';
    }
    if (amount <= 0) {
      return 'Must deposit more than $0'
    }
    if (amount > 100000) {
      return `Maximum deposit amount is $100000. Please reduce your deposit amount.`;
    }
    return null;
  }

  private getAuthorizationToken(): string | Observable<any> {
    // Test 3: Validate user authorization token
    const token = localStorage.getItem('loginToken');
    if (token !== null) {
      return token;
    }
    else {
      return throwError(() => new Error('Authentication error'));
    }

  }

}




