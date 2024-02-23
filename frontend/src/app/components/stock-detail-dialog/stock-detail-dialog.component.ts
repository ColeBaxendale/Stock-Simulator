/**
 * Stock Detail Dialog Component
 * 
 * Filename: stock-detail-dialog.component.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description: 
 * This component represents a dialog that displays detailed information about a stock, 
 * including its current price, profit/loss, and symbol. It also provides functionality 
 * to sell or buy the stock. The component utilizes Angular Material for dialog functionality 
 * and communicates with other components to perform stock transactions.
 * 
 * @param {MatDialogRef<StockDetailDialogComponent>} dialogRef - Reference to the dialog instance
 * @param {any} data - Data passed to the dialog, including stock information
 * @param {StockService} stockService - Service for fetching stock-related data
 * @param {UserServiceService} userService - Service for user-related operations
 * 
 * Algorithm Strategy:
 * 1. Initialize the component with current price, profit/loss, and symbol from input data.
 * 2. Set up an interval to refresh the current price every 10 seconds.
 * 3. Implement methods to fetch and update the current price, sell the stock, and buy more of the stock.
 * 4. Ensure proper handling of component lifecycle by unsubscribing from the interval when destroyed.
 */

import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { StockService } from '../../services/stockRouteService/stock-service.service';
import { UserServiceService } from '../../services/userRouteService/user-service.service';
import { TransactionComponent } from '../transaction/transaction.component';
import { StockSharedServiceService } from '../../services/currentStockService/stock-shared-service.service';
import { StockBuySellService } from '../../services/buySellRouteService/stock-buy-sell.service';
import { BuyStockDialogPortfolioComponent } from '../buy-stock-dialog-portfolio/buy-stock-dialog-portfolio.component';
import { CurrentPriceSymbolSharedServiceService } from '../../services/currentPriceSymbolSharedService/current-price-symbol-shared-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-detail-dialog',
  templateUrl: './stock-detail-dialog.component.html',
  styleUrls: ['./stock-detail-dialog.component.sass']
})
export class StockDetailDialogComponent implements OnInit, OnDestroy {
  sellQuantity: number = 1;
  currentPrice = -1;
  profitLoss: number | undefined;
  symbol!: string;
  ownedShares: number | undefined;
  averageBuyPrice: number | undefined;
  private subscriptions: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<StockDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private stockService: StockService,
    private userService: UserServiceService,
    private dialog: MatDialog,
    private stockSharedService: StockSharedServiceService,
    private buySellStockService: StockBuySellService,
    private currentPriceSymbolSharedService: CurrentPriceSymbolSharedServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to updates from the shared service
    this.subscriptions.add(this.stockSharedService.currentStockDetails$.subscribe(stockDetails => {
      if (stockDetails) {
        this.symbol = stockDetails.symbol;
        this.currentPrice = stockDetails.currentPrice;
        this.profitLoss = stockDetails.profitLoss;
        this.averageBuyPrice = stockDetails.averageBuyPrice
        this.ownedShares = stockDetails.ownedShares;
      }
    }));
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.subscriptions.unsubscribe();
  }
  
  // Method to sell the stock
  sellStock(): void {
    // Call the parent component's sellStock method if available
    if (this.data.sellStock && typeof this.data.sellStock === 'function') {
      this.data.sellStock(this.symbol, this.sellQuantity, this.currentPrice);
      this.dialogRef.close();
    } else {
      console.error('sellStock function not provided');
    }
  }


      
  // Method to buy more of the stock
  buyStock(symbol: string, currentPrice: number): void {
    const dialogRef = this.dialog.open(BuyStockDialogPortfolioComponent, {
      width: '400px',
      data: { symbol: symbol, currentPrice: currentPrice }
    });
  }





  viewTransactions(symbol: string) {
    const dialogRef = this.dialog.open(TransactionComponent, {
      width: '1200px', // Adjust width as needed
      data: {
        symbol: this.symbol
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  viewStockPage(symbol: string){
    this.router.navigate(['/stock', symbol]);
    this.closeDialog();
  }

    // Function to close the dialog
    closeDialog(): void {
      this.dialogRef.close();
    }
}
