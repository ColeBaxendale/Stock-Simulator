import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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

  constructor(public dialogRef: MatDialogRef<SecurityQuestionsDialogComponent>) {}

  onSave(): void {
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
