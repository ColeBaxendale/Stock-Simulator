import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-transaction-filter-dialog',
  templateUrl: './transaction-filter-dialog.component.html',
  styleUrls: ['./transaction-filter-dialog.component.sass']
})
export class TransactionFilterDialogComponent {
  selectedType: string = ''; // Store selected transaction type
  selectedStartDate: Date | null = null; // Store selected start date
  selectedEndDate: Date | null = null; // Store selected end date
  ticker: string = ''; // Store ticker filter value

  constructor(
    public dialogRef: MatDialogRef<TransactionFilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // Function to close the dialog
  closeDialog(): void {
    this.dialogRef.close();
  }

  // Function to apply filters and close the dialog
  applyFilters(): void {
    const filters = {
      type: this.selectedType,
      startDate: this.selectedStartDate,
      endDate: this.selectedEndDate,
      ticker: this.ticker
    };
    this.dialogRef.close(filters);
  }
}
