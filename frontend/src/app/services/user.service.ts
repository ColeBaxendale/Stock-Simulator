// user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://your-api-url.com/users';

  constructor(private http: HttpClient) {}

  getUserInfo(userId: string): Observable<UserInfo> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.get<UserInfo>(url);
  }

  updateUserProfile(userId: string, userData: UserData): Observable<void> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.put<void>(url, userData);
  }
}

interface UserInfo {
  // Define user information properties here
  username: string;
  // Add more properties as needed
}

interface UserData {
  // Define user data properties that can be updated here
  email: string;
  // Add more properties as needed
}
