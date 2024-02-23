import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.sass'
})
export class UserDetailsComponent implements OnInit {
  @Input() username: string | null = null;
  @Input() buyingPower: number | undefined;
  @Input() profitLoss: number | undefined;
  @Input() totalInvestment: number | undefined;
  @Input() totalPortfolioValue: number | undefined;
  totalProfitLoss: number | undefined;

  constructor() { }

  ngOnInit(): void {
    this.calculateTotalProfitLoss();
    
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    // This will run when any input property changes
    if(changes['buyingPower'] || changes['totalPortfolioValue'] || changes['totalInvestment']) {
      console.log(this.totalInvestment);
      this.calculateTotalProfitLoss();
    }
  }

  calculateTotalProfitLoss(): void {
    if (this.buyingPower !== undefined && this.totalPortfolioValue !== undefined && this.totalInvestment !== undefined) {
      this.totalProfitLoss = ((this.totalPortfolioValue + this.buyingPower) - this.totalInvestment);
      console.log("totalPortfolioValue: $" + this.totalPortfolioValue + " Buying Power: $"  + this.buyingPower + " Total Invest: $ "  + this.totalInvestment );
      console.log(this.totalProfitLoss);
    }
  }

  profitLossColor(totalProfitLoss: number | undefined): string {
    if (totalProfitLoss === undefined) return 'white';
    return totalProfitLoss > 0 ? 'green' : totalProfitLoss < 0 ? 'red' : 'black';
  }
  
}