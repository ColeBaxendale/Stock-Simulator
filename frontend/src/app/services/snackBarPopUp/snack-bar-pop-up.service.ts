/**
 * Filename: snackbar-popup.service.ts
 * Author: Cole Baxendale
 * Contact: thecodercole@gmail.com
 * Creation Date: February 2024
 * Version: 1.0
 * Description: This service provides functionality for displaying snack bar notifications in an Angular application.
 * It utilizes Angular Material's MatSnackBar component to show temporary, non-disruptive messages at the bottom of the screen.
 * The service includes methods for opening a snack bar with a custom message and for checking and displaying
 * a stored message from local storage, which is particularly useful for persisting messages across navigation or page reloads.
 */

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarPopUpService {
  // Injects MatSnackBar service to utilize its open method for displaying snack bars.
  constructor(private snackBar: MatSnackBar) { }

  /**
   * Opens a snack bar with a specified message and a default action of 'Close'.
   * @param message The message to be displayed in the snack bar.
   */
  openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds before the snack bar auto-dismisses.
      horizontalPosition: 'center', // The horizontal position on the screen where the snack bar is displayed.
      verticalPosition: 'bottom' // The vertical position on the screen where the snack bar is displayed.
    });
  }

  /**
   * Checks for a stored message in local storage and displays it using the snack bar if found.
   * After displaying, the stored message is removed from local storage to prevent repeated displays.
   */
  checkAndDisplayStoredMessage(): void {
    const storedMessage = localStorage.getItem('snackbarMessage'); // Retrieves a message stored under the key 'snackbarMessage'.
    if (storedMessage) {
      this.openSnackBar(storedMessage); // Displays the retrieved message using the snack bar.
      localStorage.removeItem('snackbarMessage'); // Clears the displayed message from local storage.
    }
  }

}
