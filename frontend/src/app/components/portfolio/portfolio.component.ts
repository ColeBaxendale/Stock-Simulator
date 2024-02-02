import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { StockDetailDialogComponent } from '../stock-detail-dialog/stock-detail-dialog.component';
import { Router } from '@angular/router';

interface Stock {
  ticker: string;
  quantityOwned: number;
  averageBuyPrice: number;
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.sass']
})
export class PortfolioComponent implements OnInit {
  loading: boolean = false;
  stocks: Stock[] = [];
  sellQuantity: number = 1;
  // Removed unnecessary router: any; if you're not using Angular Router here, no need to declare it.
  
  constructor(private http: HttpClient, private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    // Fetch the portfolio data when the component initializes
    const token = localStorage.getItem('loginToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.loading = true;
    this.http.get<{ portfolio: { [ticker: string]: Omit<Stock, 'ticker'> } }>('http://localhost:3000/api/users/portfolio', { headers }).subscribe(
      (data) => {
        // Transform the portfolio data into an array of stocks
        this.stocks = Object.entries(data.portfolio).map(([ticker, { quantityOwned, averageBuyPrice }]) => ({
          ticker,
          quantityOwned,
          averageBuyPrice
        }));
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching portfolio data:', error);
        this.loading = false;
      }
    );
  }

  openDialog(stockData: any): void {
    // Open the dialog and pass the selected stock's data along with the sellStock function
    const dialogRef = this.dialog.open(StockDetailDialogComponent, {
      width: '250px',
      data: { 
        ...stockData, 
        sellStock: (ticker: string, quantityOwned: number) => this.sellStock(ticker, quantityOwned)
      }
    });
  }
  
  sellStock(stockSymbol: string, quantityOwned: number): void {
    // Confirm with the user before selling
    const confirmSell = confirm(`Are you sure you want to sell ${quantityOwned} shares of ${stockSymbol}?`);
    const token = localStorage.getItem('loginToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    if (confirmSell) {
      // Prepare the request body with the stock symbol and quantity
      const requestBody = {
        symbol: stockSymbol,
        quantity: quantityOwned
      };

      // Send a POST request to the sell-stock API endpoint
      this.http.post<any>('http://localhost:3000/api/users/sell-stock', requestBody,{ headers: headers }).subscribe({
        next: (response) => {
          // Handle the response based on the message received from the server
          console.log('Response:', response.message);
          alert('Success: ' + response.message);
          this.ngOnInit()
        },
        error: (error) => {
          // Handle any errors that occur during the API request
          console.error('Error selling stock:', error);
          alert('An error occurred while selling shares.');
        }
      });
    }
  }
}
