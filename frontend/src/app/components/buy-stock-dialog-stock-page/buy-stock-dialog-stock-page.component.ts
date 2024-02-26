/*
-----------------------------------------------------------------------
Filename: buy-stock-dialog-stock-page.component.ts
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
import { StockBuySellService } from '../../services/buySellRouteService/stock-buy-sell.service';
import { CurrentPriceSymbolSharedServiceService } from '../../services/currentPriceSymbolSharedService/current-price-symbol-shared-service.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { UserServiceService } from '../../services/userRouteService/user-service.service';
import { SnackBarPopUpService } from '../../services/snackBarPopUp/snack-bar-pop-up.service';

@Component({
  selector: 'app-buy-stock-dialog-stock-page',
  templateUrl: './buy-stock-dialog-stock-page.component.html',
  styleUrl: './buy-stock-dialog-stock-page.component.sass'
})
export class BuyStockDialogStockPageComponent {
  buyQuantity: number = 1;
  currentPrice: number;
  symbol: string;
  private destroy$ = new Subject<void>();
  buyingPower: number | undefined;

  constructor(
    public dialogRef: MatDialogRef<BuyStockDialogStockPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private buySellStockService: StockBuySellService,
    private currentPriceSymbolSharedService: CurrentPriceSymbolSharedServiceService,
    private router: Router,
    private userService: UserServiceService,
    private snackbarService: SnackBarPopUpService
  ) {
    // Initial data assignments
    this.currentPrice = data.currentPrice;
    this.symbol = data.symbol;
  }
  

  ngOnInit(): void {
    this.currentPriceSymbolSharedService.currentStockDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe(stockDetails => {
        this.symbol = stockDetails.symbol;
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
        this.router.navigate(['/dashboard']);
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


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  
}