import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserServiceService } from '../../services/user-service.service';

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

  constructor(private http: HttpClient, private router: Router, private userService: UserServiceService) { }
  ngOnInit() {
    // Set the 'chk' checkbox to be checked by default
    const chk = document.getElementById('chk') as HTMLInputElement;
    if (chk) {
      chk.checked = true;
    }
  }
  onRegister() {  
    this.registerSubscription = this.userService.register(this.registerObj).subscribe({
      next: (res: any) => {
        if (res) {
          const chk = document.getElementById('chk') as HTMLInputElement;
          if (chk) {
            chk.checked = true;
          }
          this.loginObj.email = this.registerObj.email
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
  



  
  onLogin() {
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
  




  ngOnDestroy() {
    // Unsubscribe from the observable to prevent memory leaks
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }
}