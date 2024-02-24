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
import { UserServiceService } from '../../services/userRouteService/user-service.service';
import { TransactionComponent } from '../../components/transaction/transaction.component';
import { MatDialog } from '@angular/material/dialog';
import { interval, switchMap } from 'rxjs';
import { PorfolioProfitLoss } from '../../services/profitLossService/portfolio-profitloss.service';
import { DepositComponent } from '../../components/deposit/deposit.component';
import { BuyStockDialogComponent } from '../../components/buy-stock-dialog/buy-stock-dialog.component';
import { SettingsDialogComponent } from '../../components/settings-dialog/settings-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass'
})
export class DashboardComponent implements OnInit {
  // Properties to store user information and financial metrics
  loggedInUsername: string | null = null;
  buyingPower: number | undefined;
  totalInvestment: number | undefined;
  profitLoss: number | undefined; // Updated to store the total profit/loss from the portfolio
  totalPortfolioValue: number | undefined;
  loading: boolean = true;
  constructor(
    private userService: UserServiceService,
    private dialog: MatDialog,
    private profitLossService: PorfolioProfitLoss,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Fetch user details upon component initialization
    this.fetchUserDetails();

    // Subscribe to profitLoss updates from the shared service
    this.profitLossService.totalPortfolioValue$.subscribe(totalPortfolioValue => {
      this.totalPortfolioValue = totalPortfolioValue;
  });

  this.profitLossService.isLoading$.subscribe(loading => {
    this.loading = loading;
});


  }

  // Method to fetch user details from the UserService
  fetchUserDetails(): void {
    this.userService.getUserDetails().subscribe({
      next: (response) => {
        // Set user details from the response
        this.loggedInUsername = response.username.toUpperCase();
        this.buyingPower = response.buyingPower;
        this.totalInvestment = response.totalInvestment;
      },
      error: (error) => console.error('Error fetching user details initially:', error),
    });
  }
  
  // Method to open the transactions dialog
  openTransactionsDialog(): void {
    const dialogRef = this.dialog.open(TransactionComponent, {
      width: '1200px',
      data: {} 
    });
  }


  profitLossColor(profitLoss: number | undefined): string {
    if (profitLoss === undefined) {
      return 'black'; // Handle undefined case, use white color
    } else if (profitLoss > 0) {
      return 'green'; // Profit is positive, use green color
    } else if (profitLoss < 0) {
      return 'red'; // Loss is negative, use red color
    } else {
      return 'black'; // Neutral profit/loss, use white color
    }
  }

  openDepositDialog(){
    const dialogRef = this.dialog.open(DepositComponent);
    
  }

  quickBuyDialog(){
    const dialogRef = this.dialog.open(BuyStockDialogComponent);

  }

  quickSettingsDialog(){
    const dialogRef = this.dialog.open(SettingsDialogComponent);

  }

  logout(){
    localStorage.removeItem('loginToken')
    this.router.navigate(['/login']);
  }

}