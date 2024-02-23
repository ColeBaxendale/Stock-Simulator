import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StockBuySellService } from '../../services/buySellRouteService/stock-buy-sell.service';
import { CurrentPriceSymbolSharedServiceService } from '../../services/currentPriceSymbolSharedService/current-price-symbol-shared-service.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buy-stock-dialog-stock-page',
  templateUrl: './buy-stock-dialog-stock-page.component.html',
  styleUrl: './buy-stock-dialog-stock-page.component.sass'
})
export class BuyStockDialogStockPageComponent {
  buyQuantity: number = 1;
  currentPrice: number;
  symbol: string;
  private destroy$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<BuyStockDialogStockPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private buySellStockService: StockBuySellService,
    private currentPriceSymbolSharedService: CurrentPriceSymbolSharedServiceService,
    private router: Router
  ) {
    // Initial data assignments
    this.currentPrice = data.currentPrice;
    this.symbol = data.symbol;
  }
  

  ngOnInit(): void {
    this.currentPriceSymbolSharedService.currentStockDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe(stockDetails => {
        this.symbol = stockDetails.symbol;
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
        this.router.navigate(['/dashboard']);
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


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  
}