import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root', // This makes the service a singleton available throughout the app
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  registerUser(userData: any) {
    return this.http.post(`${this.baseUrl}/users/register`, userData);
  }

  loginUser(credentials: any) {
    return this.http.post(`${this.baseUrl}/users/login`, credentials);
  }

  // Add more methods for other API endpoints as needed
}