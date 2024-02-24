import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { UserServiceService } from '../../services/userRouteService/user-service.service';
import { SnackBarPopUpService } from '../../services/snackBarPopUp/snack-bar-pop-up.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrl: './settings-dialog.component.sass'
})
export class SettingsDialogComponent {
  isDarkMode: boolean | undefined;

  constructor(
    public dialogRef: MatDialogRef<SettingsDialogComponent>,
    private dialog: MatDialog,
    private userService: UserServiceService,
    private snackbarService: SnackBarPopUpService
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  changePassword(): void {
    this.dialogRef.close();
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent);
  }

  confirmReset(): void {
    const confirmDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Reset',
        message: 'Are you sure? This action cannot be undone.'
      }
    });

    confirmDialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const confirmResetDialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: 'Confirm Reset',
            message: 'Are you REALLY REALLY sure? YOU WILL LOSE ALL DATA'
          }
        });

        confirmResetDialogRef.afterClosed().subscribe((reallyConfirmed: boolean) => {
          if (reallyConfirmed) {
            localStorage.setItem('snackbarMessage', 'Account has been reset.');
            this.userService.resetUserAccount().subscribe(() => window.location.reload());
          }
        });
      }
    });
  }
}