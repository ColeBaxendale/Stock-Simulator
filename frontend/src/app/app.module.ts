import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CurrentTimeComponent } from './components/current-time/current-time.component';
import { DatePipe } from '@angular/common';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { StockPageComponent } from './pages/stock-page/stock-page.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { StockDetailDialogComponent } from './components/stock-detail-dialog/stock-detail-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { TransactionComponent } from './components/transaction/transaction.component';
import { TransactionFilterDialogComponent } from './components/transaction-filter-dialog/transaction-filter-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MomentDateAdapter, MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter } from '@angular/material/core';
import { BuyStockComponentComponent } from './components/buy-stock-component/buy-stock-component.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    PageNotFoundComponent,
    CurrentTimeComponent,
    SearchbarComponent,
    StockPageComponent,
    PortfolioComponent,
    StockDetailDialogComponent,
    TransactionComponent,
    TransactionFilterDialogComponent,
    BuyStockComponentComponent,
    UserDetailsComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatMomentDateModule
  ],
  providers: [
    DatePipe,
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: DateAdapter, useClass: MomentDateAdapter }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
/**
 * App Module
 * 
 * Filename: app.module.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description:
 * This module is the root module of the Angular application. It declares and imports all the necessary components, modules, and services required for the application to run.
 * 
 * Algorithm Strategy:
 * No specific algorithmic strategy is implemented in this module. It mainly orchestrates the integration of various components and services within the application.
 * 
 * Params:
 * - NgModule: NgModule - Angular decorator to mark the class as an Angular module.
 */