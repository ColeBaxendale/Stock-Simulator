import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent {

  private loginSubscription: Subscription | undefined;
  private registerSubscription: Subscription | undefined;

  loginObj: any = {
    "email": "",
    "password": ""
  }

  registerObj: any = {
    "username": "",
    "email": "",
    "password": ""
  }

  constructor(private http: HttpClient, private router: Router) { }
  ngOnInit() {
    // Set the 'chk' checkbox to be checked by default
    const chk = document.getElementById('chk') as HTMLInputElement;
    if (chk) {
      chk.checked = true;
    }
  }
  onRegister() {
    console.log('Register button clicked');
    console.log('registerObj:', this.registerObj);
  
    this.registerSubscription = this.http.post('http://localhost:3000/api/users/register', this.registerObj).subscribe({
      next: (res: any) => {
        console.log('Response:', res);
        if (res.message === 'User registered successfully') {
          const chk = document.getElementById('chk') as HTMLInputElement;
          if (chk) {
            chk.checked = true;
          }
          this.loginObj.email = this.registerObj.email
          alert('User registered successfully');
          this.registerObj = {}
          this.router.navigateByUrl('');
        } else {
          alert('Register failed');
        }
      },
      error: (error: any) => {
        if (error.status === 400) {
          alert('Email already in use');
        } else {
          console.error('An error occurred:', error);
        }
      }
    });
  }



  
  onLogin() {
    console.log('Login button clicked');
    console.log('loginObj:', this.loginObj);
  
    this.loginSubscription = this.http.post('http://localhost:3000/api/users/login', this.loginObj).subscribe({
      next: (res: any) => {
        console.log('Response:', res);
        if (res.token) {
          // Successful login, store the token in local storage
          const username = res.username;
          localStorage.setItem('username', username);
          console.log(username)
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
          console.error('An error occurred:', error);
        }
      }
    });
  }
  




  ngOnDestroy() {
    // Unsubscribe from the observable to prevent memory leaks
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }
}