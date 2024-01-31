// transaction.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = 'http://your-api-url.com/transactions';

  constructor(private http: HttpClient) {}

  getTransactionHistory(userId: string): Observable<Transaction[]> {
    const url = `${this.apiUrl}/history/${userId}`;
    return this.http.get<Transaction[]>(url);
  }

  makeDeposit(userId: string, amount: number): Observable<void> {
    const url = `${this.apiUrl}/deposit/${userId}`;
    return this.http.post<void>(url, { amount });
  }
}

interface Transaction {
  date: Date;
  type: 'buy' | 'sell';
  ticker: string;
  quantity: number;
  price: number;
  // Add more transaction-related properties as needed
}
