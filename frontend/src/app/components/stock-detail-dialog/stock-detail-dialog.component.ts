import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { StockService } from '../../services/stock-service.service';
import { UserServiceService } from '../../services/user-service.service';

@Component({
  selector: 'app-stock-detail-dialog',
  templateUrl: './stock-detail-dialog.component.html',
  styleUrls: ['./stock-detail-dialog.component.sass']
})
export class StockDetailDialogComponent implements OnInit, OnDestroy {
  // Declare sellQuantity here
  sellQuantity: number = 1;
  currentPrice = -1;
  profitLoss: number | undefined;
  symbol: string | undefined;
  private alive = true;
  private subscription: Subscription | undefined;

  constructor(
    public dialogRef: MatDialogRef<StockDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private stockService: StockService,
    private userService: UserServiceService
  ) { }

  ngOnInit(): void {
    // Fetch the initial current price
    this.currentPrice = this.data.currentPrice;
    this.profitLoss = this.data.profitLoss;
    this.symbol = this.data.symbol;
    

    // Set up interval to refresh the current price every 10 seconds
    this.subscription = interval(10000) // 10 seconds
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => {
        this.fetchAndUpdateCurrentPrice();

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
    this.currentPrice = this.data.currentPrice;
    this.profitLoss = this.data.profitLoss;
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

  buyStock(): void {
    if(this.symbol && this.currentPrice != -1){
      console.log(`Buying stock with symbol: ${this.symbol} for $${this.currentPrice}`);
      const requestBody = {
        symbol: this.symbol,
        quantity: 1,
        currentPrice: this.currentPrice
      };
      this.userService.buyStock(requestBody).subscribe({
        next: (response) => {
          console.log('Response:', response.message);
          alert('Success: ' + response.message);
          this.dialogRef.close();
          window.location.reload();
        },
        error: (error) => {
          console.error('Error buying stock:', error);
        }
      });
    }
  }
}