import { Component } from '@angular/core';
import { ApiService } from '../api.service'; // Update the path as needed

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private apiService: ApiService) {}

  login() {
    const credentials = {
      email: this.email,
      password: this.password,
    };

    this.apiService.loginUser(credentials).subscribe(
      (response) => {
        // Handle a successful login response here
        console.log('Login successful', response);
      },
      (error) => {
        // Handle login error here
        console.error('Login error', error);
      }
    );
  }
}
