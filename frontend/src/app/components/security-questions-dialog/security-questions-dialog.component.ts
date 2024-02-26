/*
-----------------------------------------------------------------------
Filename: security-questions-dialog.component.ts
Author: Cole Baxendale
Contact: thecodercole@gmail.com
Creation Date: February 2024
Version: 1.0

Description:
This component handles the security questions dialog functionality including validation of answers and processing questions and answers. It utilizes Angular Material dialog for interaction with users.

Dependencies:
- Angular's core library for component functionality.
- Angular Material dialog for displaying dialog windows.
- SnackBarPopUpService for displaying snackbar notifications.

Usage:
- Include this component in the template where security questions need to be updated.
- Pre-fill securityQuestions array with the default security questions.
- Implement onSave() and onCancel() methods to handle user actions.
- Ensure proper dependency injection for SnackBarPopUpService.
- Customize validation messages as needed.
-----------------------------------------------------------------------
*/

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackBarPopUpService } from '../../services/snackBarPopUp/snack-bar-pop-up.service';

@Component({
  selector: 'app-security-questions-dialog',
  templateUrl: './security-questions-dialog.component.html',
  styleUrls: ['./security-questions-dialog.component.sass']
})
export class SecurityQuestionsDialogComponent {
  // Pre-filled security questions
  securityQuestions: any[] = [
    { question: 'What was your first pet’s name?', answer: '' },
    { question: 'What was the model of your first car?', answer: '' }
  ];

  constructor(public dialogRef: MatDialogRef<SecurityQuestionsDialogComponent>, private snackbarService: SnackBarPopUpService) {}

  onSave(): void {
    // Validate answers
    const invalidBlankAnswer = this.securityQuestions.find(q => q.answer.trim() === '');
    if (invalidBlankAnswer) {
      this.snackbarService.openSnackBar('Answers must not be blank.');
      return;
    }

    const invalidLengthAnswer = this.securityQuestions.find(q => q.answer.trim().length > 100);
    if (invalidLengthAnswer) {
      this.snackbarService.openSnackBar('Answers must be less than 100 characters long.');
      return;
    }

    const invalidShortAnswer = this.securityQuestions.find(q => q.answer.trim().length < 3);
    if (invalidShortAnswer) {
      this.snackbarService.openSnackBar('Answers must be at least 3 characters long.');
      return;
    }

    // Process questions and answers
    const processedQuestions = this.securityQuestions.map(q => ({
      question: q.question, // No need to capitalize as these are pre-filled
      answer: q.answer.toLowerCase(),
    }));
    this.dialogRef.close(processedQuestions);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
