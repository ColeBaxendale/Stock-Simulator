/**
 * Stock Detail Dialog Component
 * 
 * Filename: stock-detail-dialog.component.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description: 
 * This component represents a dialog that displays detailed information about a stock, 
 * including its current price, profit/loss, and symbol. It also provides functionality 
 * to sell or buy the stock. The component utilizes Angular Material for dialog functionality 
 * and communicates with other components to perform stock transactions.
 * 
 * @param {MatDialogRef<StockDetailDialogComponent>} dialogRef - Reference to the dialog instance
 * @param {any} data - Data passed to the dialog, including stock information
 * @param {StockService} stockService - Service for fetching stock-related data
 * @param {UserServiceService} userService - Service for user-related operations
 * 
 * Algorithm Strategy:
 * 1. Initialize the component with current price, profit/loss, and symbol from input data.
 * 2. Set up an interval to refresh the current price every 10 seconds.
 * 3. Implement methods to fetch and update the current price, sell the stock, and buy more of the stock.
 * 4. Ensure proper handling of component lifecycle by unsubscribing from the interval when destroyed.
 */

import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { StockService } from '../../services/stock-service.service';
import { UserServiceService } from '../../services/user-service.service';
import { TransactionComponent } from '../transaction/transaction.component';

@Component({
  selector: 'app-stock-detail-dialog',
  templateUrl: './stock-detail-dialog.component.html',
  styleUrls: ['./stock-detail-dialog.component.sass']
})
export class StockDetailDialogComponent implements OnInit, OnDestroy {

  sellQuantity: number = 1; // Sell quantity for the stock
  currentPrice = -1; // Current price of the stock
  profitLoss: number | undefined; // Profit or loss of the stock
  symbol: string | undefined; // Symbol of the stock
  private alive = true; // Flag to keep track of component's lifecycle
  private subscription: Subscription | undefined; // Subscription for the interval

  constructor(
    public dialogRef: MatDialogRef<StockDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private stockService: StockService,
    private userService: UserServiceService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // Initialize current price, profit/loss, and symbol
    this.currentPrice = this.data.currentPrice;
    this.profitLoss = this.data.profitLoss;
    this.symbol = this.data.symbol;

    // Set up interval to refresh the current price every 10 seconds
    this.subscription = interval(10000) // 10 seconds
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => {
        this.fetchAndUpdateCurrentPrice();
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the interval when the dialog is destroyed
    this.alive = false;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Method to fetch and update the current price
  fetchAndUpdateCurrentPrice(): void {
    this.currentPrice = this.data.currentPrice;
    this.profitLoss = this.data.profitLoss;
  }

  // Method to sell the stock
  sellStock(): void {
    // Call the parent component's sellStock method if available
    if (this.data.sellStock && typeof this.data.sellStock === 'function') {
      this.data.sellStock(this.data.ticker, this.sellQuantity, this.currentPrice);
      this.dialogRef.close();
    } else {
      console.error('sellStock function not provided');
    }
  }

  // Method to buy more of the stock
  buyStock(): void {
    // Check if symbol and current price are available
    if (this.symbol && this.currentPrice != -1) {
      console.log(`Buying stock with symbol: ${this.symbol} for $${this.currentPrice}`);
      // Prepare request body
      const requestBody = {
        symbol: this.symbol,
        quantity: 1,
        currentPrice: this.currentPrice
      };
      // Make API call to buy stock
      this.userService.buyStock(requestBody).subscribe({
        next: (response) => {
          console.log('Response:', response.message);
          alert('Success: ' + response.message);
          this.dialogRef.close(); // Close the dialog after buying
          window.location.reload(); // Reload the page to update data
        },
        error: (error) => {
          console.error('Error buying stock:', error);
        }
      });
    }
  }
  viewTransactions(symbol: string) {
    const dialogRef = this.dialog.open(TransactionComponent, {
      width: '1200px', // Adjust width as needed
      data: {
        symbol: this.symbol
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


    // Function to close the dialog
    closeDialog(): void {
      this.dialogRef.close();
    }
}
