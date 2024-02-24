/**
 * Login Component
 * 
 * Filename: login.component.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description: 
 * This component represents the login page of the application. It provides a form
 * for users to input their credentials and authenticate themselves. The component 
 * handles user input validation and communicates with the authentication service 
 * to verify user credentials and initiate login procedures.
 * 
 * Algorithm Strategy:
 * 1. Initialize the component and its properties, including form controls for user input.
 * 2. Implement methods to handle user registration and login.
 * 3. Utilize Angular's HTTP client to communicate with the server-side authentication API.
 * 4. Subscribe to the authentication service observables to handle responses and errors.
 * 5. Implement ngOnDestroy lifecycle hook to unsubscribe from subscriptions and prevent memory leaks.
 * 
 * Params:
 * - HttpClient: HttpClient - Angular HTTP client for making requests to the server.
 * - Router: Router - Angular router for navigation.
 * - UserServiceService: UserServiceService - Service for user-related operations.
 */

// Import necessary modules
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserServiceService } from '../../services/userRouteService/user-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../../components/forgot-password/forgot-password.component';
import { SecurityQuestionsDialogComponent } from '../../components/security-questions-dialog/security-questions-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarPopUpService } from '../../services/snackBarPopUp/snack-bar-pop-up.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit, OnDestroy {
  // Define private variables to hold subscriptions
  private loginSubscription: Subscription | undefined;
  private registerSubscription: Subscription | undefined;

  // Initialize objects for login and registration
  loginObj: any = {
    "email": "",
    "password": ""
  };

  registerObj: any = {
    "username": "",
    "email": "",
    "password": "",
    "securityQuestions": []
  };


  constructor(private http: HttpClient, private router: Router, private userService: UserServiceService, private dialog: MatDialog,private snackbarService: SnackBarPopUpService) { }

  ngOnInit(): void {
    // Set the 'chk' checkbox to be checked by default
    const chk = document.getElementById('chk') as HTMLInputElement;
    if (chk) {
      chk.checked = true;
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from the observable to prevent memory leaks
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
    if (this.registerSubscription) {
      this.registerSubscription.unsubscribe();
    }
  }

  // Function to handle user registration
  onRegister(): void {
    if (!this.registerObj.username || this.registerObj.username === '') {
      this.snackbarService.openSnackBar('Username is required.');
      return;
    }
    // Test for input length exceeding the maximum allowed
    if (this.registerObj.username.length > 50) {
      this.snackbarService.openSnackBar('Username length exceeds maximum allowed');
      return;
    }
    // Test for input length not exceeding the minimum allowed
    if (this.registerObj.username.length < 4) {
      this.snackbarService.openSnackBar('Username must be more than 4 characters');
      return;
    }

    if (!this.registerObj.email || this.registerObj.email === '') {
      this.snackbarService.openSnackBar('Email is required.');
      return;
    }
    // Test for input length exceeding the maximum allowed
    if (this.registerObj.email.length > 100) {
      this.snackbarService.openSnackBar('Email length exceeds maximum allowed');
      return;
    }
    // Check for valid email format using a regular expression
    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(this.registerObj.email)) {
      this.snackbarService.openSnackBar('Invalid email format');
      return;
    }
    // Lowercase email to standardize
    this.registerObj.email = this.registerObj.email.toLowerCase();

    if (!this.registerObj.password || this.registerObj.password === '') {
      this.snackbarService.openSnackBar('Password is required.');
      return;
    }
    // Test for input length exceeding the maximum allowed
    if (this.registerObj.password.length > 100) {
      this.snackbarService.openSnackBar('Password length exceeds maximum allowed');
      return;
    }
    // Validate password format using a regular expression
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(this.registerObj.password)) {
      this.snackbarService.openSnackBar('Password must be at least 8 characters with a mix of letters, numbers, and symbols');
      return;
    }

    this.registerObj.email = this.registerObj.email.toLowerCase();
    const dialogRef = this.dialog.open(SecurityQuestionsDialogComponent, {
      width: '800px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Assuming result is the array of security questions and answers
        const processedQuestions = result.map((q: { question: string; answer: string; }) => ({
          question: q.question, // Ensure proper capitalization/formatting if needed
          answer: q.answer.toLowerCase(), // Lowercase the answer
        }));
        
        // Add the security questions to the register object
        this.registerObj.securityQuestions = processedQuestions;
  
        // Proceed with the registration
        this.registerSubscription = this.userService.register(this.registerObj).subscribe({
          next: (res: any) => {
            if (res) {
              // Reset the form
              this.resetForm();
              this.snackbarService.openSnackBar('Registration successful: ' + res.message);
            } else {
              this.snackbarService.openSnackBar('Registration failed.');
            }
          },
          error: (error: any) => {
            this.snackbarService.openSnackBar('Registration error: ' + error.message);
          }
        });
      } else {
        // User closed the dialog without submitting the form
        this.snackbarService.openSnackBar('Closed without registering.');
      }
    });
  }


  private resetForm(): void {
    const chk = document.getElementById('chk') as HTMLInputElement;
    if (chk) {
      chk.checked = true; // Switch back to the login form
    }
    // Clear the registration object
    this.registerObj.username = '';
    this.registerObj.email = '';
    this.registerObj.password = '';
  }



  // Function to handle user login
  onLogin(): void {
    this.loginObj.email = this.loginObj.email.toLowerCase();
    this.loginSubscription = this.userService.login(this.loginObj).subscribe({
      next: (res: any) => {
        if (res.token) {
          // Successful login, store the token in local storage
          localStorage.setItem('loginToken', res.token);
          this.router.navigateByUrl('/dashboard');
        } else {
          this.snackbarService.openSnackBar('Login failed');
        }
      },
      error: (error: any) => {
        if (error.status === 401) {
          this.snackbarService.openSnackBar('Invalid email or password');
        } else {
          this.snackbarService.openSnackBar(error.message);
        }
      }
    });
  }


  forgotPassword() {
    const dialogRef = this.dialog.open(ForgotPasswordComponent, {
      width: '800px',
    });
  }

}
