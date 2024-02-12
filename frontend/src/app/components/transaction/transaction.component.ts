/**
 * Transaction Component
 * 
 * Filename:transaction.component.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * This component is responsible for displaying and managing the transaction history
 * of a user. It allows for viewing all transactions, filtering based on various criteria
 * such as symbol, type, and date, and sorting transactions. The component uses Angular
 * Material for UI elements and dialogues for advanced filtering capabilities.
 *
 * Features:
 * - Displays a list of all user transactions fetched from the server.
 * - Provides functionality to filter transactions based on symbol, type, date, etc.
 * - Supports sorting transactions in ascending or descending order based on any column.
 * - Utilizes Angular Material Dialog for setting up advanced filters.
 *
 * Usage:
 * This component is intended to be used as part of the user dashboard, where users can
 * view their complete transaction history, filter through their transactions for better
 * insights, and sort them as required.
 *
 * Implementation:
 * - The component fetches transaction data on initialization and stores it in an array.
 * - Filters and sorting criteria are applied to the transaction data as per the user's input.
 * - Angular Material Dialog is used to present a filter dialogue to the user for setting up
 *   advanced filters.
 */

import { Component, Inject, OnInit } from '@angular/core';
import { UserServiceService } from '../../services/user-service.service';
import { HttpClient } from '@angular/common/http';
import { TransactionFilterDialogComponent } from '../transaction-filter-dialog/transaction-filter-dialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

// Define the structure of a Transaction object
interface Transaction {
  transactionType: string,
  symbol: string,
  quantity: number,
  price: number,
  totalPrice: number,
  timestamp: Date,
  [key: string]: string | number | Date; // Index signature allowing string keys
}

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.sass']
})
export class TransactionComponent implements OnInit {
  loading: boolean = false;
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = []; // Filtered transactions based on user criteria
  sortDirection: { [key: string]: string } = {}; // Store sorting direction for each column
  showFilterButtons: boolean = true;

  constructor(
    private userService: UserServiceService,
    private http: HttpClient,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<TransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.loading = true;
    this.fetchTransactionData();
    if (this.data && this.data.symbol) {
      this.applyInitialSymbolFilter(this.data.symbol);
      this.showFilterButtons = false; // Hide filter buttons if a symbol is provided
    } else {
      this.showFilterButtons = true; // Show filter buttons otherwise
    }
  }

  applyInitialSymbolFilter(symbol: string) {
    // Ensure the filter is case-insensitive and direct comparison
    this.filteredTransactions = this.filteredTransactions.filter(transaction => transaction.symbol.toLowerCase() === symbol.toLowerCase());
  }

  fetchTransactionData() {
    this.userService.getUserTransactions().subscribe({
      next: (data: { transactions: Transaction[] }) => {
        this.transactions = data.transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        this.filteredTransactions = [...this.transactions];
        this.loading = false;
  
        // Apply symbol filter after data is fetched and sorted
        if (this.data && this.data.symbol) {
          this.applyInitialSymbolFilter(this.data.symbol);
        }
      },
      error: (error) => {
        console.error('Error fetching transaction data:', error);
        this.loading = false;
      }
    });
  }

  // Function to toggle sorting direction for a column
  toggleSortDirection(column: string) {
    this.sortDirection[column] = this.sortDirection[column] === 'asc' ? 'desc' : 'asc';
    // Sort transactions based on the selected column and direction
    this.filteredTransactions.sort((a, b) => {
      const direction = this.sortDirection[column] === 'asc' ? 1 : -1;
      return a[column] > b[column] ? direction : -direction;
    });
  }

  // Function to open filter dialog
  openFilterDialog(): void {
    const dialogRef = this.dialog.open(TransactionFilterDialogComponent, {
      width: '400px', // Adjust width as needed
      data: {
        showFilterButtons: this.showFilterButtons
      }
    });

    dialogRef.afterClosed().subscribe((filters: any) => {
      if (filters) {
        // Apply filters to transactions
        this.filteredTransactions = this.transactions.filter(transaction => {
          let matchTicker = true;
          let matchType = true;
          let matchStartDate = true;
          let matchEndDate = true;

          // Check if ticker matches filter, if filter is not empty
          if (filters.ticker && filters.ticker !== '') {
            matchTicker = transaction.symbol.toLowerCase().includes(filters.ticker.toLowerCase());
          }

          // Check if type matches filter, if filter is not empty
          if (filters.type && filters.type !== '') {
            matchType = transaction.transactionType === filters.type;
          }

        // Check if start date matches filter, if filter is not null
        if (filters.startDate) {
          const startDate = new Date(filters.startDate);
          startDate.setHours(0, 0, 0, 0); // Set to the first minute of the day
          matchStartDate = new Date(transaction.timestamp) >= startDate;
        }

        // Check if end date matches filter, if filter is not null
        if (filters.endDate) {
          const endDate = new Date(filters.endDate);
          endDate.setHours(23, 59, 59, 999); // Set to the last minute of the day
          matchEndDate = new Date(transaction.timestamp) <= endDate;
        }
          // Return true if all conditions are met, otherwise false
          
          return matchTicker && matchType && matchStartDate && matchEndDate;
        });
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  clearFilters(): void {
    this.filteredTransactions = [...this.transactions]; // Reset filtered transactions to contain all transactions
  }
}
