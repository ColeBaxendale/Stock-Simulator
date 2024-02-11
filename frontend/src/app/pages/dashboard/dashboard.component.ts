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
import { TransactionComponent } from '../../components/transaction/transaction.component';
import { MatDialog } from '@angular/material/dialog';
import { interval, switchMap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass'
})
export class DashboardComponent implements OnInit {
  loggedInUsername: string | null = null;
  buyingPower: number | undefined;
  totalInvestment: number | undefined;
  profitLoss: number | undefined;

  constructor(
    private http: HttpClient, 
    private userService: UserServiceService, 
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Initialize user details fetching
    this.fetchUserDetails();

    // Set up interval to refresh user details every 10 seconds
    const userDetailsRefreshInterval = interval(10000).pipe(
      switchMap(() => this.userService.getUserDetails())
    );

    userDetailsRefreshInterval.subscribe({
      next: (response: { username: string; buyingPower: number | undefined; totalInvestment: number | undefined; }) => {
        this.loggedInUsername = response.username.toUpperCase();
        this.buyingPower = response.buyingPower;
        this.totalInvestment = response.totalInvestment;
        console.log('refresh');
        
      },
      error: (error: any) => console.error('Error refreshing user details:', error),
    });
  }

  fetchUserDetails(): void {
    this.userService.getUserDetails().subscribe({
      next: (response) => {
        this.loggedInUsername = response.username.toUpperCase();
        this.buyingPower = response.buyingPower;
        this.totalInvestment = response.totalInvestment;
      },
      error: (error) => console.error('Error fetching user details initially:', error),
    });
  }
  openTransactionsDialog(): void {
    const dialogRef = this.dialog.open(TransactionComponent, {
      width: '1200px', // Adjust width as needed
      data: {
        // Pass your transactions data to the dialog if needed
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
