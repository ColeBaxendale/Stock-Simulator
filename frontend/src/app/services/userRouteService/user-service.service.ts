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
import { SnackBarPopUpService } from '../snackBarPopUp/snack-bar-pop-up.service';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private baseUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient,private snackbarService: SnackBarPopUpService) { }

  /**
   * Registers a new user along with their security questions.
   * @param userData Contains user details including username, email, password, and security questions.
   * @returns Observable of the registration response.
   */
  register(userData: { username: string; email: string; password: string; securityQuestions: Array<{ question: string; answer: string }> }): Observable<any> {
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
      // userData includes security questions for enhanced security
      return this.http.post(`${this.baseUrl}/register`, userData).pipe(
        catchError((error) => throwError(() => new Error(error.error.message || 'Registration failed due to an unknown error')))
      );
    }
  }



  // Method to authenticate and login a user
  login(credentials: any): Observable<any> {
    // Validate email and password
    const emailErrorMessage = this.validateEmail(credentials.email);
    
    // If there are validation errors, return an observable with an error message
    if (emailErrorMessage !== null) {
      const errorMessage = emailErrorMessage || 'Unknown error message';
      return throwError(() => new Error(errorMessage));
    } else {
      if (!credentials.password || credentials.password === '') {
        return throwError(() => new Error('Password is required.'));
      }
      // Test for input length exceeding the maximum allowed
      if (credentials.password.length > 100) {
        return throwError(() => new Error('Password length exceeds maximum allowed'));
      }
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
          this.snackbarService.openSnackBar('Authentication error: ' + error);
          localStorage.setItem('snackbarMessage' , 'Please log in again.')
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
    return this.http.get<any>(url,  { headers }).pipe(
      catchError((error) => {
        const errorMessage = error.error.message; // Correct way to access the error message
        if(error.status === 403){
          // Handle authentication errors
          this.snackbarService.openSnackBar('Authentication error: ' + errorMessage);
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


  // Method to reset user account
  resetUserAccount(): Observable<any> {
    const authToken = this.getAuthorizationToken();
    const url = `${this.baseUrl}/reset-account`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });
    return this.http.put<any>(url, {}, { headers }).pipe(
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


  // Method to get user details
  getUserDetails(): Observable<any> {
    const authToken = this.getAuthorizationToken();
    const url = `${this.baseUrl}/user-details`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });
    return this.http.get<any>(url, { headers }).pipe(
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




  changeUserPassword(password: string, newPassword: string) {
    // Validate deposit amount
    const newPasswordValidation = this.validatePassword(newPassword);
    // If there are validation errors, return an observable with an error message
    if (newPasswordValidation !== null) {
      return throwError(() => new Error(newPasswordValidation));
    } else {
      // If validation passes, make HTTP POST request to deposit endpoint
      const authToken = this.getAuthorizationToken();
      const url = `${this.baseUrl}/change-password`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${authToken}`
      });
      const requestBody = {password: password, newPassword: newPassword };
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


  verifySecurityQuestions(email: string, answers: any[]): Observable<any> {
    const url = `${this.baseUrl}/verify-security-questions`;
    return this.http.post<any>(url, { email, answers }).pipe(
      catchError((error) => {
       this.snackbarService.openSnackBar('Verification error: ' + error);
        // Extract and return an error message; adjust as needed based on your API response structure
        let errorMessage = 'An error occurred during verification.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        // Return an observable error
        return throwError(() => new Error(errorMessage));
      })
    );
  }




  resetPassword(email: string, newPassword: string): Observable<any> {
    const url = `${this.baseUrl}/reset-password`;
    return this.http.post<any>(url, { email, newPassword }).pipe(
      catchError((error) => {
        this.snackbarService.openSnackBar('Verification error: ' + error);
        // Extract and return an error message; adjust as needed based on your API response structure
        let errorMessage = 'An error occurred during verification.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        // Return an observable error
        return throwError(() => new Error(errorMessage));
      })
    );
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



