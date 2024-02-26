import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserServiceService } from '../../services/userRouteService/user-service.service';
import { SnackBarPopUpService } from '../../services/snackBarPopUp/snack-bar-pop-up.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.sass'
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

  cancel(){
    this.dialogRef.close();
  }
}
