import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BuyStockDialogComponent } from '../buy-stock-dialog/buy-stock-dialog.component';
import { StockBuySellService } from '../../services/buySellRouteService/stock-buy-sell.service';
import { CurrentPriceSymbolSharedServiceService } from '../../services/currentPriceSymbolSharedService/current-price-symbol-shared-service.service';

@Component({
  selector: 'app-buy-stock-dialog-portfolio',
  templateUrl: './buy-stock-dialog-portfolio.component.html',
  styleUrls: ['./buy-stock-dialog-portfolio.component.sass'] // Corrected to 'styleUrls'
})
export class BuyStockDialogPortfolioComponent {
  buyQuantity: number = 1;
  currentPrice: number;
  symbol: string;

  constructor(
    public dialogRef: MatDialogRef<BuyStockDialogComponent>, // Ensure this matches the type of dialog being referenced
    @Inject(MAT_DIALOG_DATA) public data: any,
    private buySellStockService: StockBuySellService,
    private currentPriceSymbolSharedService: CurrentPriceSymbolSharedServiceService,
  ) {
    this.currentPrice = data.currentPrice;
    this.symbol = data.symbol;
  }

  ngOnInit(): void {
    this.currentPriceSymbolSharedService.currentStockDetails$.subscribe(stockDetails => {
      this.currentPrice = stockDetails.currentPrice;
    });
  }
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
      next: (response) => {
        alert('Stock purchased successfully.');
        this.dialogRef.close(); // Correct placement of the close dialog call
        window.location.reload()
      },
      error: (error) => {
        alert('Failed to purchase stock.');
        // Optionally, you can close the dialog here as well or handle the error differently.
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
