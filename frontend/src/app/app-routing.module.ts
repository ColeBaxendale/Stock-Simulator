/**
 * App Routing Module
 * 
 * Filename: app-routing.module.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description:
 * This module defines the routing configuration for the application.
 * It maps different URL paths to corresponding components, enabling navigation within the app.
 * 
 * Algorithm Strategy:
 * 1. Define an array of routes, each containing a path and its corresponding component.
 * 2. Use the RouterModule to configure the routes for the application.
 * 3. Use pathMatch property to specify how to match routes.
 * 4. Utilize canActivate property to guard routes based on authentication status.
 * 5. Handle wildcard route '**' to redirect to a 'PageNotFoundComponent' for undefined routes.
 * 
 * Params:
 * - NgModule: NgModule - Angular module decorator to define the routing module.
 * - RouterModule: RouterModule - Angular module for routing and navigation.
 * - Routes: Routes - Array containing route definitions with path-component mappings.
 * - LoginComponent: LoginComponent - Component representing the login page.
 * - DashboardComponent: DashboardComponent - Component representing the dashboard page.
 * - StockPageComponent: StockPageComponent - Component representing the stock page.
 * - PageNotFoundComponent: PageNotFoundComponent - Component representing the page not found error.
 * - AuthGuard: AuthGuard - Guard service to protect routes based on authentication status.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AuthGuard } from './authGuard/authGuard';
import { StockPageComponent } from './pages/stock-page/stock-page.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], pathMatch: 'full', },
  { path: 'stock/:symbol', component: StockPageComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
