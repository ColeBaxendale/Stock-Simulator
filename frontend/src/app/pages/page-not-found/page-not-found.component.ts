/**
 * Page Not Found Component
 * 
 * Filename: page-not-found.component.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description: 
 * This component represents the page displayed when a user navigates to a route 
 * that does not exist in the application. It provides a user-friendly message 
 * indicating that the requested page could not be found, along with options to 
 * navigate back to the home page or any other valid page in the application.
 */

// Import necessary modules from Angular
import { Component } from '@angular/core';

// Define the component decorator with its selector, template, and styles
@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.sass']
})
export class PageNotFoundComponent {
}
