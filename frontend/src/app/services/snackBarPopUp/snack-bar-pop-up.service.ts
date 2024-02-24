import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarPopUpService {

  constructor(private snackBar: MatSnackBar) { }

  openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'center', // Position horizontally
      verticalPosition: 'bottom' // Position vertically
    });
  }

  checkAndDisplayStoredMessage(): void {
    const storedMessage = localStorage.getItem('snackbarMessage');
    if (storedMessage) {
      this.openSnackBar(storedMessage);
      // Clear the stored message after displaying it
      localStorage.removeItem('snackbarMessage');
    }
  }

}