/*
-----------------------------------------------------------------------
Filename: deposit.component.ts
Author: Cole Baxendale
Contact: thecodercole@gmail.com
Creation Date: February 2024
Version: 1.0

Description:
This component implements functionality for depositing funds into the user's account. It validates the deposit amount, calls the UserServiceService to perform the deposit operation, and handles success and error cases accordingly.

Dependencies:
- Angular's HttpClient for making HTTP requests.
- Angular Material dialog for displaying dialog windows.
- UserServiceService for handling user-related operations.
- SnackBarPopUpService for displaying notifications.

Usage:
- Include this component in the template where deposit functionality is required.
- Handle the deposit process and display feedback to the user accordingly.
- Customize validation messages and error handling as needed.
-----------------------------------------------------------------------
*/

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserServiceService } from '../../services/userRouteService/user-service.service';
import { SnackBarPopUpService } from '../../services/snackBarPopUp/snack-bar-pop-up.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.sass']
})
export class DepositComponent {
  amountModel: string = '';

  constructor(
    private http: HttpClient,
    private userService: UserServiceService,
    private dialogRef: MatDialogRef<DepositComponent>,
    private snackbarService: SnackBarPopUpService
  ) { }

  deposit(amount: string) {
    const amountNum = this.validAmount(amount);

    if (amountNum !== -1) {
      // Call the deposit method from UserService
      this.userService.deposit(amountNum).subscribe({
        next: (response) => {
          // Handle successful deposit here
          this.dialogRef.close();
          localStorage.setItem('snackbarMessage', 'Deposit successful!');
          window.location.reload();
        },
        error: (error) => {
          // Handle error here
          this.snackbarService.openSnackBar(`Deposit failed: ${error.message}`);
          this.amountModel = ''; // Clear the input on error
        }
      });
    } else {
      this.amountModel = ''; // Clear the input field if validation fails
    }
  }

  validAmount(amount: string) {
    const maxDepositAmount = 100000;
    const depositAmount = parseFloat(amount);

    if (isNaN(depositAmount)) {
      this.snackbarService.openSnackBar('Must be a valid number');
      return -1;
    } 
    else if (depositAmount <= 0) {
      this.snackbarService.openSnackBar('Amount must be more than zero');
      return -1;
    } 
    else if (depositAmount > maxDepositAmount) {
      this.snackbarService.openSnackBar('Cannot deposit more than $' + maxDepositAmount);
      return -1;
    }

    return depositAmount; 
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
