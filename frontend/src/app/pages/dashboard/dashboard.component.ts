/**
 * Dashboard Component
 * 
 * Filename: dashboard.component.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description: 
 * This component represents the main dashboard of the application. It displays various
 * metrics, charts, and information relevant to the user's portfolio and stock data. 
 * The component is responsible for fetching and presenting data in an organized and 
 * user-friendly manner, providing an overview of the user's financial status.
 * 
 * Algorithm Strategy:
 * 1. Initialize the component and its properties, including data to be displayed.
 * 2. Implement methods to fetch and update dashboard data, such as user details.
 * 3. Utilize Angular's lifecycle hooks to handle component initialization and data fetching.
 * 4. Ensure error handling to manage failures in data retrieval.
 * 
 * Params:
 * - http: HttpClient - Angular HTTP client for making HTTP requests.
 * - userService: UserServiceService - Service for fetching user details.
 */

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../services/user-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass'
})
export class DashboardComponent implements OnInit {
  loggedInUsername: string | null = null;

  constructor(private http: HttpClient, private userService: UserServiceService) { }

  ngOnInit(): void {
    // Fetch user details when the component initializes
    this.userService.getUserDetails().subscribe({
      next: (response) => {
        // Set the username to loggedInUsername
        this.loggedInUsername = response.username.toUpperCase();
      },
      error: (error) => {
        console.error('Error fetching username:', error);
      },
    });
  }
}
