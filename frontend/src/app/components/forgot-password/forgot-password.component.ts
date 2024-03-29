/*
-----------------------------------------------------------------------
Filename: forgot-password.component.ts
Author: Cole Baxendale
Contact: thecodercole@gmail.com
Creation Date: February 2024
Version: 1.0

Description:
This component implements functionality for handling password reset requests. It collects user email and security question answers, verifies them with the UserServiceService, and opens the PasswordResetDialogComponent for password reset upon successful verification.

Dependencies:
- Angular's core library for component functionality.
- Angular Material dialog for displaying dialog windows.
- Angular Material snackbar for displaying notifications.
- UserServiceService for handling user-related operations.
- PasswordResetDialogComponent for resetting passwords.

Usage:
- Include this component in the template where password reset functionality is required.
- Handle the password reset process and display feedback to the user accordingly.
- Customize security question answers and error handling as needed.
-----------------------------------------------------------------------
*/

import { Component } from '@angular/core';
import { UserServiceService } from '../../services/userRouteService/user-service.service';
import { PasswordResetDialogComponent } from '../password-reset-dialog/password-reset-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackBarPopUpService } from '../../services/snackBarPopUp/snack-bar-pop-up.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.sass']
})
export class ForgotPasswordComponent {
  userEmail = '';
  securityAnswers = [
    { question: 'What was your first pet’s name?', answer: '' },
    { question: 'What was the model of your first car?', answer: '' }
  ];

  dialogRef!: MatDialogRef<ForgotPasswordComponent>; // Declare dialogRef with definite assignment assertion

  constructor(private userService: UserServiceService, private dialog: MatDialog, private snackbarService: SnackBarPopUpService) {}

  requestPasswordReset(): void {
    // Check if any answer is blank
    const isAnyAnswerBlank = this.securityAnswers.some(answer => answer.answer.trim() === '');

    if (isAnyAnswerBlank) {
      this.snackbarService.openSnackBar('Please provide answers to all security questions.');
      return;
    }

    // Process answers to ensure they are in lowercase
    const processedAnswers = this.securityAnswers.map(answer => ({
      question: answer.question, // Assuming questions don't need to be modified
      answer: answer.answer.toLowerCase() // Convert answer to lowercase
    }));

    // Call service to verify security questions with processed answers
    this.userService.verifySecurityQuestions(this.userEmail, processedAnswers).subscribe({
      next: (response) => {
        // If verification successful, open dialog for password reset
        this.openPasswordResetDialog();
        // Close the forgot password dialog
        this.dialogRef.close();
      },
      error: (error) => {
        this.snackbarService.openSnackBar(error);
      }
    });
  }

  openPasswordResetDialog(): void {
    const dialogRef = this.dialog.open(PasswordResetDialogComponent, {
      data: { userEmail: this.userEmail } // Pass user email to dialog if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackbarService.openSnackBar('Password Reset Successful');
      } else {
        this.snackbarService.openSnackBar('Password Reset Cancelled');
      }
      this.dialog.closeAll();
      // You can handle the result here if needed
    });
  }

  cancel(): void {
    this.dialog.closeAll();
  }
}
