import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { StockDetailDialogComponent } from '../stock-detail-dialog/stock-detail-dialog.component';
import { Router } from '@angular/router';
import { UserServiceService } from '../../services/user-service.service';
import { StockService } from '../../services/stock-service.service';
import { interval } from 'rxjs';


interface Stock {
  ticker: string;
  quantityOwned: number;
  averageBuyPrice: number;
  currentPrice?: number; 
  profitLoss?: number;
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

  constructor(private http: HttpClient, private dialog: MatDialog, private router: Router, private userService: UserServiceService, private stockService: StockService) {}

  ngOnInit(): void {
    this.loading = true;
    this.fetchPortfolioData(); // Initial fetch
  
    // Set up interval to fetch portfolio data every 10 seconds
    const portfolioUpdateInterval = interval(10000); // 10 seconds
    portfolioUpdateInterval.subscribe(() => {
      this.fetchPortfolioData();
    });
  }

  fetchPortfolioData(): void {
    const token = localStorage.getItem('loginToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    this.http.get<{ portfolio: { [ticker: string]: Omit<Stock, 'ticker'> } }>(this.userService.getUserPortfolio(), { headers }).subscribe(
      (data) => {
        // Transform the portfolio data into an array of stocks
        this.stocks = Object.entries(data.portfolio).map(([ticker, { quantityOwned, averageBuyPrice }]) => ({
          ticker,
          quantityOwned,
          averageBuyPrice,
          currentPrice: undefined, 
          profitLoss: undefined,
        }));
        this.stocks.forEach((stock) => {
          this.fetchCurrentPrices(stock);
        });
      },
      (error) => {
        console.error('Error fetching portfolio data:', error);
      }
    );
  }

  fetchCurrentPrices(stock: Stock): void {
    this.stockService.searchStock(stock.ticker).subscribe(
      (data) => {
        const stockData = data['currentPrice'];
        if (stockData) {
          
          stock.currentPrice = stockData
          stock.profitLoss = (stockData - stock.averageBuyPrice) * stock.quantityOwned;
        } else {
          console.error(`Error fetching current prices for ${stock.ticker}`);
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching current prices:', error);
        this.loading = false;
      }
    );
  }
  

  openDialog(stockData: any): void {
    // Open the dialog and pass the selected stock's data along with the current price and sellStock function
    const dialogRef = this.dialog.open(StockDetailDialogComponent, {
      width: '250px',
      data: {
        ...stockData,
        sellStock: (ticker: string, quantityOwned: number) => this.sellStock(ticker, quantityOwned)
      }
    });
  }
  
  sellStock(stockSymbol: string, quantityOwned: number): void {
    this.stockService.searchStock(stockSymbol).subscribe(
      (stockData) => {
        // Check if the stockData contains the current price
        const currentPrice = stockData?.currentPrice;
  
        if (currentPrice !== undefined) {
          const requestBody = {
            symbol: stockSymbol,
            quantity: quantityOwned,
            currentPrice: currentPrice
          };
  
          // Make the sellStock API call
          this.userService.sellStock(requestBody).subscribe({
            next: (response) => {
              console.log('Response:', response.message);
              alert('Success: ' + response.message);
              this.ngOnInit(); // Refresh the portfolio after selling
            },
            error: (error) => {
              console.error('Error selling stock:', error);
            }
          });
        } else {
          console.error(`Error fetching current price for ${stockSymbol}`);
        }
      }
    );
  }
  
}  