/*
-----------------------------------------------------------------------
Filename: confirmation-dialog.component.ts
Author: Cole Baxendale
Contact: thecodercole@gmail.com
Creation Date: February 2024
Version: 1.0

Description:
This component represents a confirmation dialog used to confirm actions with the user. It receives data about the title and message to be displayed in the dialog.

Dependencies:
- Angular Material dialog for creating dialog windows.

Usage:
- Include this component in the template where confirmation dialogs are needed.
- Pass data containing the title and message to the component when opening the dialog.
-----------------------------------------------------------------------
*/

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.sass']
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, message: string }
  ) {}
}
