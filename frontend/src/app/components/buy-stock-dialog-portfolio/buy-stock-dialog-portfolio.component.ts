import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BuyStockDialogComponent } from '../buy-stock-dialog/buy-stock-dialog.component';
import { StockBuySellService } from '../../services/buySellRouteService/stock-buy-sell.service';

@Component({
  selector: 'app-buy-stock-dialog-portfolio',
  templateUrl: './buy-stock-dialog-portfolio.component.html',
  styleUrl: './buy-stock-dialog-portfolio.component.sass'
})
export class BuyStockDialogPortfolioComponent {
  buyQuantity: number = 1;
  currentPrice: number;
  symbol: string;

  constructor(
    public dialogRef: MatDialogRef<BuyStockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private buySellStockService: StockBuySellService
  ) {
    this.currentPrice = data.currentPrice;
    this.symbol = data.symbol;
  }

  ngOnInit(): void {}

  buyStock(): void {
    if (this.buyQuantity <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    const requestBody = {
      symbol: this.symbol,
      quantity: this.buyQuantity,
      currentPrice: this.currentPrice
    };

    this.buySellStockService.buyStock(requestBody).subscribe({
      next: (response) => alert('Stock purchased successfully.'),
      error: (error) => alert('Failed to purchase stock.')
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}