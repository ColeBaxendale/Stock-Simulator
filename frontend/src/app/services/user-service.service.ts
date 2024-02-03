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
    const usernameErrorMessage = this.validateUsername(userData.username);
    const emailErrorMessage = this.validateEmail(userData.email);
    const passwordErrorMessage = this.validatePassword(userData.password);
    if (usernameErrorMessage !== null || emailErrorMessage !== null || passwordErrorMessage !== null) {
      const errorMessage = usernameErrorMessage || emailErrorMessage || passwordErrorMessage || 'Unknown error message';
      throw new Error(errorMessage);
    } else {
      return this.http.post(`${this.baseUrl}/register`, userData);
    }
  }

  login(credentials: any): Observable<any> {
    const emailErrorMessage = this.validateEmail(credentials.email);
    const passwordErrorMessage = this.validatePassword(credentials.password);
    if (emailErrorMessage !== null || passwordErrorMessage !== null) {
      const errorMessage = emailErrorMessage || passwordErrorMessage || 'Unknown error message';
      throw new Error(errorMessage);
    } else {
      return this.http.post(`${this.baseUrl}/login`, credentials);
    }
  }
  

  buyStock(symbol: string, quantity: number): Observable<any> {
    const symbolErrorMessage = this.validateStockSymbol(symbol);
    const quantityErrorMessage = this.isValidQuantity(quantity);
    if (symbolErrorMessage !== null || quantityErrorMessage !== null) {
      const errorMessage = symbolErrorMessage || quantityErrorMessage || 'Unknown error message';
      throw new Error(errorMessage);
    } else {
      const url = `${this.baseUrl}/buy-stock`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.getAuthorizationHeaders()}`
      });
      const requestBody = { symbol: symbol, quantity: quantity };
      return this.http.post<any>(url, requestBody, { headers });
    }
  }

  sellStock(symbol: string, quantity: number): Observable<any> {
    const symbolErrorMessage = this.validateStockSymbol(symbol);
    const quantityErrorMessage = this.isValidQuantity(quantity);
    if (symbolErrorMessage !== null || quantityErrorMessage !== null) {
      const errorMessage = symbolErrorMessage || quantityErrorMessage || 'Unknown error message';
      throw new Error(errorMessage);
    } else {
      const url = `${this.baseUrl}/sell-stock`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.getAuthorizationHeaders()}`
      });
      const requestBody = { symbol: symbol, quantity: quantity };
      return this.http.post<any>(url, requestBody, { headers });
    }
  }
  
  deposit(deposit: number) : Observable<any>{
    const depositErrorMessage = this.depositValidation(deposit);
    if(depositErrorMessage !==  null){
      throw new Error(depositErrorMessage);
    } else{

     const url = `${this.baseUrl}/deposit`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.getAuthorizationHeaders()}`
      });
      const requestBody = { deposit: deposit}; // check
      return this.http.post<any>(url, requestBody, { headers });
    }
  }
  
  getUserPortfolio() : Observable<any>{
     const url = `${this.baseUrl}/get-portfolio`; // check
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.getAuthorizationHeaders()}`
      });
      return this.http.get<any>(url,{ headers });
  }

  getUserTransactions() : Observable<any>{
    const url = `${this.baseUrl}/transaction-history`; // check
     const headers = new HttpHeaders({
       Authorization: `Bearer ${this.getAuthorizationHeaders()}`
     });
     return this.http.get<any>(url,{ headers });
 }

 resetUserAccount() : Observable<any>{
  const url = `${this.baseUrl}/reset`; // check
   const headers = new HttpHeaders({
     Authorization: `Bearer ${this.getAuthorizationHeaders()}`
   });
   return this.http.post<any>(url,{ headers });
}

getUserDetails() : Observable<any>{
  const url = `${this.baseUrl}/get-account`; // check
   const headers = new HttpHeaders({
     Authorization: `Bearer ${this.getAuthorizationHeaders()}`
   });
   return this.http.get<any>(url,{ headers });
}


changeUserDetails(username: string, email: string) : Observable<any>{
  const usernameErrorMessage = this.validateUsername(username);
  const emailErrorMessage = this.validateEmail(email);
  if (usernameErrorMessage !== null || emailErrorMessage !== null) {
    const errorMessage = usernameErrorMessage || emailErrorMessage || 'Unknown error message';
    throw new Error(errorMessage);
  } else {
    const url = `${this.baseUrl}/change-account`; // check
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthorizationHeaders()}`
    });
    const requestBody = { username: username, email: email};
    return this.http.post<any>(url, requestBody, { headers });
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
    if (quantity || isNaN(quantity)) {
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
    if (amount <= 0 ) {
        return 'Must deposit more than $0'
    }
    if(amount > 100000){
      return `Maximum deposit amount is $100000. Please reduce your deposit amount.`;
    }
    return null;
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




