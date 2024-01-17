import { Component } from '@angular/core';
import { ApiService } from '../api.service'; // Update the path as needed
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private apiService: ApiService) {}

  register() {
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    this.apiService.registerUser(userData).subscribe(
      (response) => {
        // Handle a successful registration response here
        console.log('Registration successful');
        this.router.navigate(['/login']);
      },
      (error) => {
        // Handle registration error here
        console.error('Registration error', error);
      }
    );
  }
}
