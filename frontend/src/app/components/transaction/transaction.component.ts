import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../services/user-service.service';
import { HttpClient } from '@angular/common/http';

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
  sortDirection: { [key: string]: string } = {}; // Store sorting direction for each column

  constructor(
    private userService: UserServiceService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loading = true;
    this.fetchTransactionData();
  }

  fetchTransactionData() {
    this.userService.getUserTransactions().subscribe(
      (data: { transactions: Transaction[] }) => {
        this.transactions = data.transactions;
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
    this.transactions.sort((a, b) => {
      const direction = this.sortDirection[column] === 'asc' ? 1 : -1;
      return a[column] > b[column] ? direction : -direction;
    });
  }
}
