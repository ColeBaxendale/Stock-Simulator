import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PorfolioProfitLoss {
  private totalPortfolioValueSource = new BehaviorSubject<number>(0);
  totalPortfolioValue$ = this.totalPortfolioValueSource.asObservable();

  // Add loading state management
  private isLoadingSource = new BehaviorSubject<boolean>(true);
  isLoading$ = this.isLoadingSource.asObservable();

  updatetotalPortfolioValue(totalPortfolioValue: number) {
    this.totalPortfolioValueSource.next(totalPortfolioValue);
  }

  // Method to update loading state
  setLoading(isLoading: boolean) {
    this.isLoadingSource.next(isLoading);
    console.log(`Loading State Updated: ${isLoading}`);
  }
}
