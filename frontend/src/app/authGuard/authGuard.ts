/**
 * Auth Guard
 * 
 * Filename: auth-guard.service.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description: 
 * This module provides a guard service to protect routes from unauthorized access.
 * It implements the CanActivate interface to control access based on authentication
 * status. If the user is authenticated, canActivate() returns true allowing access 
 * to the protected route. If the user is not authenticated, it redirects to the login
 * page and returns false, preventing access to the protected route.
 * 
 * Params: None
 * Time Complexity: O(1)
 * Algorithm Strategy: This guard service checks for the presence of a valid authentication 
 * token in local storage. If the token is present and not expired, the user is considered
 * authenticated and allowed access. If the token is missing or expired, the user is 
 * redirected to the login page.
 * 
 */

// Import statements for Angular modules
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Get the token from local storage or wherever it's stored
    const token = localStorage.getItem('loginToken');

    if (!token) {
      // If there's no token, the user is not authenticated
      this.router.navigate(['/login']); // Redirect to login page
      return false; // Prevent access to the protected route
    }

    // Decode the token to get the expiration time
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = tokenData.exp * 1000; // Convert to milliseconds

    // Check if the token has expired
    if (Date.now() >= expirationTime) {
      // If the token has expired, the user is not authenticated
      this.router.navigate(['/login']); // Redirect to login page
      return false; // Prevent access to the protected route
    }

    // If the token is valid and hasn't expired, the user is authenticated
    return true; // Allow access to the protected route
  }
}
