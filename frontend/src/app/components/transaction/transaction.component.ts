import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../services/user-service.service';
import { HttpClient } from '@angular/common/http';
import { TransactionFilterDialogComponent } from '../transaction-filter-dialog/transaction-filter-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

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
  

  constructor(
    private userService: UserServiceService,
    private http: HttpClient,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<TransactionComponent>
  ) {}

  ngOnInit() {
    this.loading = true;
    this.fetchTransactionData();
  }

  fetchTransactionData() {
    this.userService.getUserTransactions().subscribe(
      (data: { transactions: Transaction[] }) => {
        // Sort transactions by timestamp in descending order
        this.transactions = data.transactions.sort((a, b) => {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
        // Initialize filtered transactions with all transactions
        this.filteredTransactions = [...this.transactions]; 
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching transaction data:', error);
        this.loading = false;
      }
    );
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
