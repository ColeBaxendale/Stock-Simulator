import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserServiceService } from '../../services/user-service.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass'
})
export class DashboardComponent {
  loggedInUsername: string | null = null;
  constructor(private http: HttpClient, private userService: UserServiceService) { }


  ngOnInit(): void {
    this.userService.getUserDetails().subscribe({
      next: (response) => {
        // Set the username to loggedInUsername
        this.loggedInUsername = response.username.toUpperCase();
      },
      error: (error) => {
        console.error('Error fetching username:', error);
      },
    });
  }
}