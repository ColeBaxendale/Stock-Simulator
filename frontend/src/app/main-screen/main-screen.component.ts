import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit {
  username: string;

  constructor(
    private authService: AuthenticationService,
    private router: Router // Inject Router here
  ) {}

  ngOnInit() {
   
    
  }

  logout() {
    this.authService.clearAuthToken();
    this.router.navigate(['/login']);

  }
}
