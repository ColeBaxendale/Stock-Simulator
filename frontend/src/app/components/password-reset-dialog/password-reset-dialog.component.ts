import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserServiceService } from '../../services/userRouteService/user-service.service';
import { SnackBarPopUpService } from '../../services/snackBarPopUp/snack-bar-pop-up.service';

@Component({
  selector: 'app-password-reset-dialog',
  templateUrl: './password-reset-dialog.component.html',
  styleUrl: './password-reset-dialog.component.sass'
})
export class PasswordResetDialogComponent {
  newPassword: string = '';

  constructor(
    public dialogRef: MatDialogRef<PasswordResetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userEmail: string },
    private userService: UserServiceService,
    private snackbarService: SnackBarPopUpService
  ) {}

  onSubmit(): void {
    if (!this.newPassword || this.newPassword === '') {
      this.snackbarService.openSnackBar( 'Password is required.');
      return;
    }
    // Test for input length exceeding the maximum allowed
    if (this.newPassword.length > 100) {
      this.snackbarService.openSnackBar( 'Password length exceeds maximum allowed');
      return;
    }
    // Validate password format using a regular expression
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(this.newPassword)) {
      this.snackbarService.openSnackBar( 'Password must be at least 8 characters with a mix of letters, numbers, and symbols');
      return;
    }
    // Call service to reset password
    this.userService.resetPassword(this.data.userEmail, this.newPassword).subscribe({
      next: (response) => {
        this.dialogRef.close(true); // Pass true to indicate successful password reset
      },
      error: (error) => {
        this.snackbarService.openSnackBar(error);
        // Handle error, possibly display error message to user
      }
    });
  }

  onClose(): void {
    this.dialogRef.close(false); // Pass false to indicate password reset cancelled
  }


}