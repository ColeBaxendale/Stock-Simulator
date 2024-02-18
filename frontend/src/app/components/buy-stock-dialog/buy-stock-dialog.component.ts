import { Component } from '@angular/core';
import { StockBuySellService } from '../../services/buySellRouteService/stock-buy-sell.service';
import { StockService } from '../../services/stockRouteService/stock-service.service';

@Component({
  selector: 'app-buy-stock-dialog',
  templateUrl: './buy-stock-dialog.component.html',
  styleUrls: ['./buy-stock-dialog.component.sass']
})
export class BuyStockDialogComponent {
  stockSymbol: string = '';
  currentPrice: number | null = null;
  quantity: number = 1;

  constructor(private buySellStockService: StockBuySellService, private stockService: StockService) {}

  // Handler for when a stock is selected from the SearchbarComponent
  handleStockSelected(symbol: string): void {
    this.stockSymbol = symbol;
    this.stockService.searchStock(symbol).subscribe({
      next: (data) => {
        this.currentPrice = data['currentPrice'];

      },
      error: (error) => {
        console.error(`Error fetching current prices for ${symbol}`, error);

      }
    });
  }

  handleInputChange(): void {
    this.currentPrice = null; // Clear current price
    this.stockSymbol = '';
  }

  // Initiates the stock purchase
  buyStock(): void {
    if (!this.stockSymbol || this.quantity <= 0 || this.currentPrice === null) {
      alert('Please select a stock, enter a valid quantity, and ensure price is available.');
      return;
    }
    const requestBody = {
      symbol: this.stockSymbol,
      quantity: this.quantity,
      currentPrice: this.currentPrice // TypeScript now knows this can't be null
    };
    
    this.buySellStockService.buyStock(requestBody).subscribe({
      next: (response) => {
        console.log('Response:', response.message); // Log success message
        alert('Success: ' + response.message); // Show success message
        window.location.reload();

      },
      error: (error) => {
        console.error('Error selling stock:', error); // Log error if selling stock fails
      }
    });
  }
}


