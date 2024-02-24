import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserServiceService } from '../../services/userRouteService/user-service.service';
import { SnackBarPopUpService } from '../../services/snackBarPopUp/snack-bar-pop-up.service';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.sass'
})
export class ChangePasswordDialogComponent {
  password: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  email: string = '';
  constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<ChangePasswordDialogComponent>, private userService: UserServiceService,private snackbarService: SnackBarPopUpService) { }

  changePassword() {
    // Check if new password and confirm password match
    if (this.newPassword !== this.confirmPassword) {
      this.snackbarService.openSnackBar('New passwords do not match.');
      return;
    }
    // Call the service to change the password
    this.userService.changeUserPassword(this.password, this.newPassword)
      .subscribe({
        next: (response) => {
          // Handle successful password change
         
          this.snackbarService.openSnackBar('Password changed successfully.');
          this.closeDialog();
        },
        error: (error) => {
          this.snackbarService.openSnackBar(error.error.message || 'Error changing password.');
        }
      });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}