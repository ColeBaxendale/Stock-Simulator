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
      this.router.navigate(['/login']);
      return false;
    }

    // Decode the token to get the expiration time
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
    // Check if the token has expired
    if (Date.now() >= expirationTime) {
      // If the token has expired, the user is not authenticated
      this.router.navigate(['/login']);
      return false;
    }

    // If the token is valid and hasn't expired, the user is authenticated
    return true;
  }
}
