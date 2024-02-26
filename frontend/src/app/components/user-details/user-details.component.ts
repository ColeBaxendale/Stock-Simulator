/*
-----------------------------------------------------------------------
Filename: user-details.component.ts
Author: Cole Baxendale
Contact: thecodercole@gmail.com
Creation Date: February 2024
Version: 1.0

Description:
This component handles the display of user details including username, buying power, profit/loss, total investment, and total portfolio value. It calculates and displays the total profit/loss based on these values and updates dynamically when any input property changes. It also provides a method to determine the color of the profit/loss value for visual representation.

Dependencies:
- Angular's core library for component, input, and lifecycle hook functionalities.

Usage:
- Include this component in the template where user details need to be displayed.
- Bind input properties to respective data from the parent component.
- The component will automatically calculate and display the total profit/loss.
- Use the profitLossColor() method to determine the color of the profit/loss value for visual representation.
-----------------------------------------------------------------------
*/

import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.sass']
})
export class UserDetailsComponent implements OnInit {
  @Input() username: string | null = null;
  @Input() buyingPower: number | undefined;
  @Input() profitLoss: number | undefined;
  @Input() totalInvestment: number | undefined;
  @Input() totalPortfolioValue: number | undefined;
  @Input() loading: boolean | undefined;
  totalProfitLoss: number | undefined;

  constructor() { }

  ngOnInit(): void {
    this.calculateTotalProfitLoss();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // This will run when any input property changes
    if(changes['buyingPower'] || changes['totalPortfolioValue'] || changes['totalInvestment']) {
      this.calculateTotalProfitLoss();
    }
  }

  calculateTotalProfitLoss(): void {
    if (this.buyingPower !== undefined && this.totalPortfolioValue !== undefined && this.totalInvestment !== undefined) {
      this.totalProfitLoss = ((this.totalPortfolioValue + this.buyingPower) - this.totalInvestment);
    }
  }

  profitLossColor(totalProfitLoss: number | undefined): string {
    if (totalProfitLoss === undefined) return 'white';
    return totalProfitLoss > 0 ? 'green' : totalProfitLoss < 0 ? 'red' : 'black';
  }
}
