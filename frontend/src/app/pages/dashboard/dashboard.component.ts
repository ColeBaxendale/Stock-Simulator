import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass'
})
export class DashboardComponent {
  loggedInUsername: string | null = null;
  constructor(private http: HttpClient) { }


  ngOnInit(): void {
    // Retrieve the JWT token from local storage
    const token = localStorage.getItem('loginToken');

    // Create headers with the token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}` // Assuming your server expects the token in the "Authorization" header
    });

    // Make an HTTP GET request to fetch the username with the token in the headers
    this.http.get<any>('http://localhost:3000/api/users/user-details', { headers }).subscribe({
      next: (response) => {
        // Set the username to loggedInUsername
        this.loggedInUsername = response.username;
      },
      error: (error) => {
        console.error('Error fetching username:', error);
      },
    });
  }
}