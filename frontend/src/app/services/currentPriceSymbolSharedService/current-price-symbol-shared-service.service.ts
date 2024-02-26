/**
 * Filename: CurrentPriceSymbolSharedServiceService.ts
 * Author: Cole Baxendale
 * Contact: thecodercole@gmail.com
 * Creation Date: February 2024
 * Version: 1.0
 * Description: This service provides a centralized mechanism for managing and sharing
 * the current price and symbol details of a stock within an Angular application. It leverages
 * RxJS BehaviorSubjects to enable components to subscribe to the latest stock details and
 * update these details dynamically across the application. The service is designed to be
 * injectable across the Angular app, ensuring that the stock details are readily available
 * wherever needed, facilitating real-time data sharing and update propagation.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentPriceSymbolSharedServiceService {
  // Initialize a BehaviorSubject to hold the current stock details with a default value.
  // BehaviorSubject allows emitting new values to subscribers and provides the current value upon subscription.
  private currentStockDetailsSource = new BehaviorSubject<{ symbol: string; currentPrice: number }>({ symbol: '', currentPrice: 0 });

  // Expose the current stock details as an Observable for components to subscribe to.
  // This allows components to reactively receive updates whenever the stock details change.
  currentStockDetails$ = this.currentStockDetailsSource.asObservable();

  // Method to update the current stock details. This is called to push new stock details to subscribers.
  // The new details are provided as an argument to this method and then emitted to all subscribers of currentStockDetails$.
  updateCurrentStockDetails(stockDetails: { symbol: string; currentPrice: number }) {
    this.currentStockDetailsSource.next(stockDetails);
  }
}
