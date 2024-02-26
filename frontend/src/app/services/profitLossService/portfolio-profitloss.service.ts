import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * PorfolioProfitLoss Service
 * 
 * Filename: porfolioProfitLoss.service.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description: 
 * This Angular service is designed to manage and broadcast the total portfolio value and loading state
 * across the application using RxJS's BehaviorSubjects. It provides a centralized way to share the 
 * total value of the user's portfolio and the loading state between different components without directly 
 * linking them. This service is injectable across the application, ensuring that any component can subscribe 
 * to the latest values of the portfolio's total value or the loading state, and react accordingly.
 * 
 * Key Features:
 * - Manages the total portfolio value as an observable stream that components can subscribe to.
 * - Manages a loading state to indicate when data is being fetched, enhancing UX by allowing for loading indicators.
 * - Provides methods to update the total portfolio value and the loading state, which automatically notifies subscribed components.
 */

@Injectable({
  providedIn: 'root'
})
export class PorfolioProfitLoss {
  // BehaviorSubject to hold and emit the current total portfolio value
  private totalPortfolioValueSource = new BehaviorSubject<number>(0);
  // Observable exposed to the rest of the application for subscribing to total portfolio value changes
  totalPortfolioValue$ = this.totalPortfolioValueSource.asObservable();

  // BehaviorSubject for managing loading state, initialized as 'true' to indicate loading on startup
  private isLoadingSource = new BehaviorSubject<boolean>(true);
  // Observable exposed for subscribing to loading state changes
  isLoading$ = this.isLoadingSource.asObservable();

  /**
   * Updates the total portfolio value.
   * This method is called to update the total value of the portfolio, which then emits the new value to all subscribers.
   * @param totalPortfolioValue - The new total portfolio value to be set and emitted.
   */
  updatetotalPortfolioValue(totalPortfolioValue: number) {
    this.totalPortfolioValueSource.next(totalPortfolioValue);
  }

  /**
   * Updates the loading state of the portfolio data.
   * This method allows for the dynamic setting of the application's loading state, useful for showing or hiding loading indicators.
   * @param isLoading - The new loading state; 'true' for loading, 'false' for not loading.
   */
  setLoading(isLoading: boolean) {
    this.isLoadingSource.next(isLoading);
  }
}
