/**
 * Dashboard and Portfolio Shared Service
 * 
 * Filename: dashboard-potfolio-shared-service.service.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * This service acts as a communication bridge between the Dashboard and Portfolio components
 * within the application. It leverages the power of RxJS BehaviorSubject to share data dynamically,
 * specifically the total profit/loss value calculated within the Portfolio component, which is of
 * interest to the Dashboard component for display.
 *
 * Features:
 * - Maintains a BehaviorSubject to hold the latest value of total profit/loss.
 * - Provides an observable for components to subscribe to and receive updates on the total profit/loss.
 * - Offers a method to update the total profit/loss, which automatically notifies all subscribers.
 *
 * Usage:
 * This service is primarily used to ensure that the Dashboard component can display updated total
 * profit/loss information as calculated by the Portfolio component without directly coupling these components.
 * This design promotes a cleaner, more modular architecture by using a service-mediated communication pattern.
 *
 * Implementation:
 * - The service defines a private BehaviorSubject to hold the total profit/loss value.
 * - It exposes this BehaviorSubject as an observable for other components to subscribe to.
 * - The updateProfitLoss method allows the Portfolio component to update the total profit/loss value,
 *   which then automatically propagates this update to the Dashboard component through the observable subscription.
 *
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PorfolioProfitLoss {
   // BehaviorSubject holding the current value of total profit/loss
  private totalPortfolioValueSource = new BehaviorSubject<number>(0);
  // Publicly exposed observable of the profit/loss source for subscription
  totalPortfolioValue$ = this.totalPortfolioValueSource.asObservable();



  updatetotalPortfolioValue(totalPortfolioValue: number) {
    this.totalPortfolioValueSource.next(totalPortfolioValue); // Make sure this line exists and is executed
}
}
