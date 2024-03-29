/*
-----------------------------------------------------------------------
Filename: buy-stock-dialog-portfolio.component.ts
Author: Cole Baxendale
Contact: thecodercole@gmail.com
Creation Date: February 2024
Version: 1.0

Description:
This component represents a dialog for buying stocks on a specific page. It provides functionality to buy a certain quantity of a stock at the current price.

Dependencies:
- Angular Material dialog for creating dialog windows.
- Services for buying and selling stocks.
- Service for sharing current price and symbol information.
- Router for navigation.
- Service for retrieving user details.
- Service for displaying snack bar messages.

Usage:
- Include this component in the template where stock buying dialogs are needed.
- Pass necessary data to the component through the @Inject(MAT_DIALOG_DATA) decorator.
- Call the 'buyStock' method to initiate the stock purchase process.
- Call the 'closeDialog' method to close the dialog.
-----------------------------------------------------------------------
*/


import { Component } from '@angular/core';
import { StockBuySellService } from '../../services/buySellRouteService/stock-buy-sell.service';
import { StockService } from '../../services/stockRouteService/stock-service.service';
import { UserServiceService } from '../../services/userRouteService/user-service.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackBarPopUpService } from '../../services/snackBarPopUp/snack-bar-pop-up.service';

@Component({
  selector: 'app-buy-stock-dialog',
  templateUrl: './buy-stock-dialog.component.html',
  styleUrls: ['./buy-stock-dialog.component.sass']
})
export class BuyStockDialogComponent {
  stockSymbol: string = '';
  currentPrice: number | null = null;
  buyQuantity: number = 1;
  buyingPower: number | undefined;
  constructor(public dialogRef: MatDialogRef<BuyStockDialogComponent>, private buySellStockService: StockBuySellService, private stockService: StockService,private userService: UserServiceService, private snackbarService: SnackBarPopUpService) {}

  // Handler for when a stock is selected from the SearchbarComponent
  handleStockSelected(symbol: string): void {
    this.stockSymbol = symbol;
    this.stockService.searchStock(symbol).subscribe({
      next: (data) => {
        this.currentPrice = data['currentPrice'];

      },
      error: (error) => {
       this.snackbarService.openSnackBar(`Error fetching current prices for ${symbol}: ` + error);

      }
    });
    this.userService.getUserDetails().subscribe({
      next: (response) => {
        // Set user details from the response
        this.buyingPower = response.buyingPower;
      },
      error: (error) => this.snackbarService.openSnackBar('Error fetching user details initially: ' +  error),
    });
  }

  handleInputChange(): void {
    this.currentPrice = null; // Clear current price
    this.stockSymbol = '';
  }

  // Initiates the stock purchase
  buyStock(): void {
    if (!this.stockSymbol || this.buyQuantity <= 0 || this.currentPrice === null) {
      this.snackbarService.openSnackBar('Please select a stock, enter a valid quantity, and ensure price is available.');
      return;
    }
    const requestBody = {
      symbol: this.stockSymbol,
      quantity: this.buyQuantity,
      currentPrice: this.currentPrice // TypeScript now knows this can't be null
    };
    
    this.buySellStockService.buyStock(requestBody).subscribe({
      next: (response) => {
        localStorage.setItem('snackbarMessage' , 'Success: ' + response.message)
        window.location.reload();
        

      },
      error: (error) => {
        this.snackbarService.openSnackBar('Error selling stock: ' + error); // Log error if selling stock fails
      }
    });
  }

  getTotalCost(): string {
    if (this.currentPrice === null || this.buyQuantity <= 0) {
      return 'N/A';
    }
    return (this.currentPrice * this.buyQuantity).toFixed(2);
  }
  
  closeDialog(): void {
    this.dialogRef.close();
  }

}


