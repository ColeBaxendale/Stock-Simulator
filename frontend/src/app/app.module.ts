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
import { CommonModule, DatePipe } from '@angular/common';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { StockPageComponent } from './pages/stock-page/stock-page.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
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
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { StockDetailDialogComponent } from './components/stock-detail-dialog/stock-detail-dialog.component';
import { DepositComponent } from './components/deposit/deposit.component';
import { BuyStockDialogComponent } from './components/buy-stock-dialog/buy-stock-dialog.component';
import { BuyStockDialogPortfolioComponent } from './components/buy-stock-dialog-portfolio/buy-stock-dialog-portfolio.component';
import { BuyStockDialogStockPageComponent } from './components/buy-stock-dialog-stock-page/buy-stock-dialog-stock-page.component';
import { SettingsDialogComponent } from './components/settings-dialog/settings-dialog.component';
import { ChangePasswordDialogComponent } from './components/change-password-dialog/change-password-dialog.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SecurityQuestionsDialogComponent } from './components/security-questions-dialog/security-questions-dialog.component';
import { PasswordResetDialogComponent } from './components/password-reset-dialog/password-reset-dialog.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';


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
    UserDetailsComponent,
    DepositComponent,
    BuyStockDialogComponent,
    BuyStockDialogPortfolioComponent,
    BuyStockDialogStockPageComponent,
    SettingsDialogComponent,
    ChangePasswordDialogComponent,
    SecurityQuestionsDialogComponent,
    PasswordResetDialogComponent,
    ForgotPasswordComponent,
    ConfirmationDialogComponent

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
    MatMomentDateModule,
    CommonModule,
    MatIconModule,
  ],
  providers: [
    DatePipe,
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: DateAdapter, useClass: MomentDateAdapter }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
