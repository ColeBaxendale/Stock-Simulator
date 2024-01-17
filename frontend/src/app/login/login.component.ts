import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { ApiService } from '../api.service';
import { LoginResponse } from './login-response'; // Import the LoginResponse interface
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthenticationService,
    private router: Router // Inject Router here
  ) {}

  login() {
    const credentials = {
      email: this.email,
      password: this.password,
    };

    this.apiService.loginUser(credentials).subscribe(
      (response: LoginResponse) => { // Specify the type of response as LoginResponse
        // Handle a successful login response here
        console.log('Login successful');
        

        // Store the authentication token
        if (response.token) {
          this.authService.setAuthToken(response.token);
          this.router.navigate(['/main']);
        }
      },
      (error) => {
        // Handle login error here
        console.error('Login error', error);
      }
    );
  }
}
