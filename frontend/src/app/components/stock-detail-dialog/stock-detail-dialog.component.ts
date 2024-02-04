import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { StockService } from '../../services/stock-service.service';

@Component({
  selector: 'app-stock-detail-dialog',
  templateUrl: './stock-detail-dialog.component.html',
  styleUrls: ['./stock-detail-dialog.component.sass']
})
export class StockDetailDialogComponent implements OnInit, OnDestroy {
  // Declare sellQuantity here
  sellQuantity: number = 1;
  currentPrice: number | undefined;
  private alive = true;
  private subscription: Subscription | undefined;

  constructor(
    public dialogRef: MatDialogRef<StockDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    // Fetch the initial current price
    this.fetchAndUpdateCurrentPrice();

    // Set up interval to refresh the current price every 10 seconds
    this.subscription = interval(10000) // 10 seconds
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => {
        this.fetchAndUpdateCurrentPrice();
        console.log('update');
        
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the interval when the dialog is destroyed
    this.alive = false;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fetchAndUpdateCurrentPrice(): void {
    this.stockService.searchStock(this.data.ticker).subscribe(
      (stockData) => {
        // Check if the stockData contains the current price
        const currentPrice = stockData?.currentPrice;

        if (currentPrice !== undefined) {
          this.currentPrice = currentPrice;
        } else {
          console.error(`Error fetching current price for ${this.data.ticker}`);
        }
      }
    );
  }

  sellStock(): void {
    // Implement the sell logic here, or call the parent component's sellStock method
    if (this.data.sellStock && typeof this.data.sellStock === 'function') {
      this.data.sellStock(this.data.ticker, this.sellQuantity, this.currentPrice);
      this.dialogRef.close();
    } else {
      console.error('sellStock function not provided');
    }
  }
}
