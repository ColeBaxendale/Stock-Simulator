import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserServiceService } from '../../services/userRouteService/user-service.service';

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
  ) { }

  deposit(amount: string) {
    const amountNum = this.validAmount(amount);

    if (amountNum !== -1) {
      // Call the deposit method from UserService
      this.userService.deposit(amountNum).subscribe({
        next: (response) => {
          // Handle successful deposit here
          console.log('Deposit successful:', response);
          alert('Deposit successful!');
          this.dialogRef.close();
          window.location.reload();
        },
        error: (error) => {
          // Handle error here
          console.error('Deposit error:', error);
          alert(`Deposit failed: ${error.message}`);
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
      alert('Must be a valid number');
      return -1;
    } 
    else if (depositAmount <= 0) {
      alert('Amount must be more than zero');
      return -1;
    } 
    else if (depositAmount > maxDepositAmount) {
      alert('Cannot deposit more than $' + maxDepositAmount);
      return -1;
    }

    return depositAmount; 
  }
}
