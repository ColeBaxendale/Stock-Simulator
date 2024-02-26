import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Interface: StockDetails
 * Represents the structure for stock details managed within the application.
 * Includes symbol, current price, and optionally, owned shares, average buy price, and profit/loss data.
 */
interface StockDetails {
  symbol: string; // Stock symbol (e.g., "AAPL" for Apple Inc.)
  currentPrice: number; // Current trading price of the stock
  ownedShares?: number; // Optional: Number of shares of this stock owned by the user
  averageBuyPrice?: number; // Optional: Average price at which the current shares were purchased
  profitLoss?: number; // Optional: Calculated profit or loss on the owned shares
}

/**
 * StockSharedServiceService
 * 
 * Filename: stock-shared-service.service.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description: 
 * This Angular service is responsible for managing and sharing the details of a currently selected or viewed stock
 * across different components of the application. Utilizing RxJS's BehaviorSubject, this service allows components
 * to subscribe to updates on the stock's details, enabling a reactive and synchronized display of stock information
 * throughout the application.
 * 
 * Key Features:
 * - Holds the current stock details as an observable BehaviorSubject, allowing multiple components to react to changes.
 * - Provides methods to update or clear the current stock details, ensuring flexibility in user interactions.
 */

@Injectable({
  providedIn: 'root'
})
export class StockSharedServiceService {
  // BehaviorSubject holding the current stock details, initialized as null
  private currentStockDetailsSource = new BehaviorSubject<StockDetails | null>(null);
  // Observable for subscribing to the current stock details
  currentStockDetails$ = this.currentStockDetailsSource.asObservable();

  constructor() {}

  /**
   * Updates the current stock details.
   * This method is used to update the BehaviorSubject with new stock details, which then notifies all subscribers.
   * @param stockDetails - The new stock details to be published to subscribers.
   */
  updateCurrentStockDetails(stockDetails: StockDetails): void {
    this.currentStockDetailsSource.next(stockDetails);
  }

  /**
   * Clears the current stock details.
   * This method resets the BehaviorSubject to null, effectively notifying subscribers that there are no current stock details.
   * Useful for scenarios where the user navigates away from a detailed stock view.
   */
  clearCurrentStockDetails(): void {
    this.currentStockDetailsSource.next(null);
  }
}
