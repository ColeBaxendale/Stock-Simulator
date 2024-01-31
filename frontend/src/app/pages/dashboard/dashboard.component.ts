import { Component } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass'
})
export class DashboardComponent {
  loggedInUsername: string | null = null;


  ngOnInit(): void {
    this.loggedInUsername = localStorage.getItem('username');
  }
}
