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


import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BuyStockDialogComponent } from '../buy-stock-dialog/buy-stock-dialog.component';
import { StockBuySellService } from '../../services/buySellRouteService/stock-buy-sell.service';
import { CurrentPriceSymbolSharedServiceService } from '../../services/currentPriceSymbolSharedService/current-price-symbol-shared-service.service';
import { UserServiceService } from '../../services/userRouteService/user-service.service';
import { SnackBarPopUpService } from '../../services/snackBarPopUp/snack-bar-pop-up.service';

@Component({
  selector: 'app-buy-stock-dialog-portfolio',
  templateUrl: './buy-stock-dialog-portfolio.component.html',
  styleUrls: ['./buy-stock-dialog-portfolio.component.sass'] // Corrected to 'styleUrls'
})
export class BuyStockDialogPortfolioComponent {
  buyQuantity: number = 1;
  currentPrice: number;
  symbol: string;
  buyingPower: number | undefined;

  constructor(
    public dialogRef: MatDialogRef<BuyStockDialogComponent>, // Ensure this matches the type of dialog being referenced
    @Inject(MAT_DIALOG_DATA) public data: any,
    private buySellStockService: StockBuySellService,
    private currentPriceSymbolSharedService: CurrentPriceSymbolSharedServiceService,
    private userService: UserServiceService,
    private snackbarService: SnackBarPopUpService
  ) {
    this.currentPrice = data.currentPrice;
    this.symbol = data.symbol;
  }

  ngOnInit(): void {
    this.currentPriceSymbolSharedService.currentStockDetails$.subscribe(stockDetails => {
      this.currentPrice = stockDetails.currentPrice;
    });
    this.userService.getUserDetails().subscribe({
      next: (response) => {
        // Set user details from the response
        this.buyingPower = response.buyingPower;
      }, 
      error: (error) => this.snackbarService.openSnackBar('Error fetching user details initially: ' + error),
    });
  }
  buyStock(): void {
    if (this.buyQuantity <= 0) {
      this.snackbarService.openSnackBar('Please enter a valid quantity.');
      return;
    }

    const requestBody = {
      symbol: this.symbol,
      quantity: this.buyQuantity,
      currentPrice: this.currentPrice
    };

    this.buySellStockService.buyStock(requestBody).subscribe({
      next: (response) => {
        this.snackbarService.openSnackBar('Stock purchased successfully.');
        this.dialogRef.close(); // Correct placement of the close dialog call
        window.location.reload()
      },
      error: (error) => {
        this.snackbarService.openSnackBar('Failed to purchase stock.');
        // Optionally, you can close the dialog here as well or handle the error differently.
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
