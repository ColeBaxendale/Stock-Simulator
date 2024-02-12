/**
 * Transaction Filter Dialog Component
 * 
 * Filename: transaction-filter-dialog.component.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * This component serves as a dialogue for setting up filters for the transaction history
 * in a user-friendly manner. It allows users to filter transactions based on type,
 * start and end dates, and ticker symbols. The component leverages Angular Material
 * Dialogs for a seamless user experience.
 *
 * Features:
 * - Provides UI elements for users to select transaction types, date ranges, and ticker symbols.
 * - Supports dynamic visibility of filter buttons based on the context in which the dialog is used.
 * - Utilizes Angular Material DialogRef for managing dialog interactions, including closing the dialog
 *   and returning the selected filters back to the parent component.
 *
 * Usage:
 * This component is intended to be used in conjunction with the Transaction Component, allowing users
 * to apply detailed filters to their transaction history. It enhances the user's ability to sift through
 * transactions based on specific criteria.
 *
 * Implementation:
 * - The dialog is initiated with default values for the filters, which can be overridden by passing data
 *   through the MAT_DIALOG_DATA injection token.
 * - Users interact with the dialog's form to set their desired filters.
 * - Upon applying the filters, the dialog closes and returns the selected filter values to the parent component,
 *   enabling the application of these filters to the transaction data.
 *
 */

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
  showFilterButtons: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<TransactionFilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.showFilterButtons !== undefined) {
      this.showFilterButtons = data.showFilterButtons;
    }
  }
  

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
