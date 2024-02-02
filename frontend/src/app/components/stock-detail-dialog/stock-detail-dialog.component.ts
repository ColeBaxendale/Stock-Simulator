import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-stock-detail-dialog',
  templateUrl: './stock-detail-dialog.component.html',
  styleUrls: ['./stock-detail-dialog.component.sass']
})
export class StockDetailDialogComponent {
  // Declare sellQuantity here
  sellQuantity: number = 1;

  constructor(
    public dialogRef: MatDialogRef<StockDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  sellStock(): void {
    // Implement the sell logic here, or call the parent component's sellStock method
    if (this.data.sellStock && typeof this.data.sellStock === 'function') {
      this.data.sellStock(this.data.ticker, this.sellQuantity);
      this.dialogRef.close();
    } else {
      console.error('sellStock function not provided');
    }
  }
}