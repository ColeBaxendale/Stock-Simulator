/**
 * User Service
 * 
 * Filename: user-service.service.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description:
 * This service provides methods for interacting with user-related data from an API.
 * It includes methods for user registration, login, and other user-related operations.
 * 
 * Algorithm Strategy:
 * 1. Implement methods to interact with user-related endpoints of the API.
 * 2. Utilize Angular's HttpClient module to make HTTP requests to the API.
 * 3. Validate input parameters before making API requests to ensure data integrity.
 * 4. Handle errors and edge cases gracefully to provide a smooth user experience.
 * 
 * Params:
 * - Injectable: Injectable - Angular decorator to mark the service as injectable.
 * - HttpClient: HttpClient - Angular HTTP client for making requests to the server.
 * - Observable: Observable - RxJS observable for handling asynchronous data streams.
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EMPTY, Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private baseUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  // Method to register a new user
  register(userData: any): Observable<any> {
    // Validate username, email, and password
    const usernameErrorMessage = this.validateUsername(userData.username);
    const emailErrorMessage = this.validateEmail(userData.email);
    const passwordErrorMessage = this.validatePassword(userData.password);
    // If there are validation errors, return an observable with an error message
    if (usernameErrorMessage !== null || emailErrorMessage !== null || passwordErrorMessage !== null) {
      const errorMessage = usernameErrorMessage || emailErrorMessage || passwordErrorMessage || 'Unknown error message';
      return throwError(() => new Error(errorMessage));
    } else {
      // If validation passes, make HTTP POST request to register endpoint
      return this.http.post(`${this.baseUrl}/register`, userData);
    }
  }

  // Method to authenticate and login a user
  login(credentials: any): Observable<any> {
    // Validate email and password
    const emailErrorMessage = this.validateEmail(credentials.email);
    const passwordErrorMessage = this.validatePassword(credentials.password);
    // If there are validation errors, return an observable with an error message
    if (emailErrorMessage !== null || passwordErrorMessage !== null) {
      const errorMessage = emailErrorMessage || passwordErrorMessage || 'Unknown error message';
      return throwError(() => new Error(errorMessage));
    } else {
      // If validation passes, make HTTP POST request to login endpoint
      return this.http.post(`${this.baseUrl}/login`, credentials);
    }
  }



  // Method to deposit funds
  deposit(amount: number): Observable<any> {
    // Validate deposit amount
    const depositErrorMessage = this.depositValidation(amount);
    // If there are validation errors, return an observable with an error message
    if (depositErrorMessage !== null) {
      return throwError(() => new Error(depositErrorMessage));
    } else {
      // If validation passes, make HTTP POST request to deposit endpoint
      const authToken = this.getAuthorizationToken();
      const url = `${this.baseUrl}/deposit`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${authToken}`
      });
      const requestBody = { amount: amount };
      return this.http.post<any>(url, requestBody, { headers }).pipe(
        catchError((error) => {
          // Handle authentication errors
          console.error('Authentication error:', error);
          alert('Please log in again.');
          localStorage.removeItem('loginToken');
          window.location.reload();
          // Return an observable with an error message
          return throwError(() => new Error('Authentication error'));
        })
      );
    }
  }

  // Method to get user portfolio
  getUserPortfolio(): string {
    return 'http://localhost:3000/api/users/portfolio';
  }

  // Method to get user transactions
  getUserTransactions(): Observable<any> {
    const authToken = this.getAuthorizationToken();
    const url = `${this.baseUrl}/transaction-history`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });
    return this.http.get<any>(url, { headers }).pipe(
      catchError((error) => {
        // Handle authentication errors
        console.error('Authentication error:', error);
        alert('Please log in again.');
        localStorage.removeItem('loginToken');
        window.location.reload();
        // Return an observable with an error message
        return throwError(() => new Error('Authentication error'));
      })
    );
  }

  // Method to reset user account
  resetUserAccount(): Observable<any> {
    const authToken = this.getAuthorizationToken();
    const url = `${this.baseUrl}/reset-account`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });
    return this.http.get<any>(url, { headers }).pipe(
      catchError((error) => {
        // Handle authentication errors
        console.error('Authentication error:', error);
        alert('Please log in again.');
        localStorage.removeItem('loginToken');
        window.location.reload();
        // Return an observable with an error message
        return throwError(() => new Error('Authentication error'));
      })
    );
  }

  // Method to get user details
  getUserDetails(): Observable<any> {
    const authToken = this.getAuthorizationToken();
    const url = `${this.baseUrl}/user-details`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });
    return this.http.get<any>(url, { headers }).pipe(
      catchError((error) => {
        // Handle authentication errors
        console.error('Authentication error:', error);
        alert('Please log in again.');
        localStorage.removeItem('loginToken');
        window.location.reload();
        // Return an observable with an error message
        return throwError(() => new Error('Authentication error'));
      })
    );
  }

  // Method to change user details
  changeUserDetails(username: string, email: string): Observable<any> {
    // Validate username and email
    const usernameErrorMessage = this.validateUsername(username);
    const emailErrorMessage = this.validateEmail(email);
    // If there are validation errors, return an observable with an error message
    if (usernameErrorMessage !== null || emailErrorMessage !== null) {
      const errorMessage = usernameErrorMessage || emailErrorMessage || 'Unknown error message';
      return throwError(() => new Error(errorMessage));
    } else {
      // If validation passes, make HTTP POST request to change-user-details endpoint
      const authToken = this.getAuthorizationToken();
      const url = `${this.baseUrl}/change-user-details`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${authToken}`
      });
      const requestBody = { username: username, email: email };
      return this.http.post<any>(url, requestBody, { headers }).pipe(
        catchError((error) => {
          // Handle authentication errors
          console.error('Authentication error:', error);
          alert('Please log in again.');
          localStorage.removeItem('loginToken');
          window.location.reload();
          // Return an observable with an error message
          return throwError(() => new Error('Authentication error'));
        })
      );
    }
  }

  // Method to validate username
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

  // Method to validate email
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
    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      return 'Invalid email format';
    }
    // If all checks pass, return null (no error)
    return null;
  }

  // Method to validate password
  private validatePassword(password: string): string | null {
    // Check if the Password is missing or empty
    if (!password || password === '') {
      return 'Password is required.';
    }
    // Test for input length exceeding the maximum allowed
    if (password.length > 100) {
      return 'Password length exceeds maximum allowed';
    }
    // Validate password format using a regular expression
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return 'Password must be at least 8 characters with a mix of letters, numbers, and symbols';
    }
    // If all checks pass, return null (no error)
    return null;
  }



  // Method to validate deposit amount
  private depositValidation(amount: number): string | null {
    
    if (amount === undefined || amount === null || isNaN(amount)) {
      return 'Amount is required.';
  }
  if (amount <= 0) {
      return 'Must deposit more than $0';
  }
  if (amount > 100000) {
      return `Maximum deposit amount is $100000. Please reduce your deposit amount.`;
  }
  return null; // Indicates the validation passed
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
