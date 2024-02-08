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
import { UserServiceService } from '../../services/user-service.service';

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
    "password": ""
  };

  constructor(private http: HttpClient, private router: Router, private userService: UserServiceService) { }

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
    this.registerSubscription = this.userService.register(this.registerObj).subscribe({
      next: (res: any) => {
        if (res) {
          const chk = document.getElementById('chk') as HTMLInputElement;
          if (chk) {
            chk.checked = true;
          }
          this.loginObj.email = this.registerObj.email;
          this.registerObj.username = '';
          this.registerObj.email = '';
          this.registerObj.password = ''; 
          alert('Response: ' + res.message);
        } else {
          alert('Register failed');
        }
      },
      error: (error: any) => {
        alert(error.message); // Display the error message from the thrown error
      }
    });
  }

  // Function to handle user login
  onLogin(): void {
    this.loginSubscription = this.userService.login(this.loginObj).subscribe({
      next: (res: any) => {
        console.log('Response:', res);
        if (res.token) {
          // Successful login, store the token in local storage
          localStorage.setItem('loginToken', res.token);
          this.router.navigateByUrl('/dashboard');
        } else {
          alert('Login failed');
        }
      },
      error: (error: any) => {
        if (error.status === 401) {
          alert('Invalid email or password');
        } else {
          alert(error.message);
        }
      }
    });
  }
}
