import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.sass'
})
export class UserDetailsComponent implements OnInit {
  @Input() username: string | null = null;
  @Input() buyingPower: number | undefined;
  @Input() totalInvestment: number | undefined;
  @Input() profitLoss: number | undefined;

  constructor() { }

  ngOnInit(): void {
  }


  profitLossColor(profitLoss: number | undefined): string {
    if (profitLoss === undefined) return 'white';
    return profitLoss > 0 ? 'green' : profitLoss < 0 ? 'red' : 'white';
  }
  
}