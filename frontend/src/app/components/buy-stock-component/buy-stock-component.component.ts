import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-buy-stock-component',
  templateUrl: './buy-stock-component.component.html',
  styleUrl: './buy-stock-component.component.sass'
})
export class BuyStockComponentComponent {
  buyQuantity: number = 1; // Default buy quantity

  constructor(
    public dialogRef: MatDialogRef<BuyStockComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { symbol: string, currentPrice: number }
  ) {}

  onBuy(): void {
    // You can perform the buy operation here or pass this data back to the parent dialog to handle
    this.dialogRef.close(this.buyQuantity);
  }
}