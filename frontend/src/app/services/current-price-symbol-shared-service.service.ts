import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentPriceSymbolSharedServiceService {

  private currentStockDetailsSource = new BehaviorSubject<{ symbol: string; currentPrice: number }>({ symbol: '', currentPrice: 0 });
  currentStockDetails$ = this.currentStockDetailsSource.asObservable();

  updateCurrentStockDetails(stockDetails: { symbol: string; currentPrice: number }) {
    this.currentStockDetailsSource.next(stockDetails);
  }
}