// authentication.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private authTokenKey = 'authToken';

  constructor() {}

  setAuthToken(token: string): void {
    // Store the token in an HttpOnly cookie for enhanced security
    document.cookie = `authToken=${token}; HttpOnly; Secure; SameSite=Strict`;
  }

  getAuthToken(): string | null {
    const authToken = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith('authToken='));
    return authToken ? authToken.split('=')[1] : null;
  }

  clearAuthToken(): void {
    // Clear the authentication token from the cookie
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; HttpOnly; Secure; SameSite=Strict';
  }
}
