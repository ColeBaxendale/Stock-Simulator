import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { UserServiceService } from '../../services/userRouteService/user-service.service';
import { SnackBarPopUpService } from '../../services/snackBarPopUp/snack-bar-pop-up.service';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrl: './settings-dialog.component.sass'
})
export class SettingsDialogComponent {
  isDarkMode: boolean | undefined;

  constructor(public dialogRef: MatDialogRef<SettingsDialogComponent>, private dialog: MatDialog,private userService: UserServiceService,private snackbarService: SnackBarPopUpService) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  changePassword(): void {
    this.dialogRef.close();
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent);
  
    }


  confirmReset(): void {    
    if (window.confirm('Are you sure?')) {
      // @ts-ignore
      if (window.confirm('Are you REALLY REALLY sure? YOU WILL LOSE ALL DATA')){
        localStorage.setItem('snackbarMessage' , 'Account has been reset.')
        this.userService.resetUserAccount().subscribe(() => window.location.reload());
      }
    }
  }

}