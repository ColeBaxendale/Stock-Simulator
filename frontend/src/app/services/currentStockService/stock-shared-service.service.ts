import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface StockDetails {
  symbol: string;
  currentPrice: number;
  ownedShares?: number; // Optional, depending on whether you have this data
  averageBuyPrice?: number;
  profitLoss?: number;
}

@Injectable({
  providedIn: 'root'
})
export class StockSharedServiceService {
  private currentStockDetailsSource = new BehaviorSubject<StockDetails | null>(null);
  currentStockDetails$ = this.currentStockDetailsSource.asObservable();

  constructor() {}

  // Method to update the current stock details
  updateCurrentStockDetails(stockDetails: StockDetails): void {
    this.currentStockDetailsSource.next(stockDetails);
  }

  // Method to clear the current stock details (optional, depending on your use case)
  clearCurrentStockDetails(): void {
    this.currentStockDetailsSource.next(null);
  }
}
