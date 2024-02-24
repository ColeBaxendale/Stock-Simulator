import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarPopUpService } from '../../services/snackBarPopUp/snack-bar-pop-up.service';

@Component({
  selector: 'app-security-questions-dialog',
  templateUrl: './security-questions-dialog.component.html',
  styleUrl: './security-questions-dialog.component.sass'
})
export class SecurityQuestionsDialogComponent {
  // Pre-filled security questions
  securityQuestions: any[] = [
    { question: 'What was your first pet’s name?', answer: '' },
    { question: 'What was the model of your first car?', answer: '' }
  ];

  constructor(public dialogRef: MatDialogRef<SecurityQuestionsDialogComponent>,private snackbarService: SnackBarPopUpService) {}

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