/**
 * App Component
 * 
 * Filename: app.component.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description:
 * This component represents the root component of the application.
 * It defines the selector, template, and styles for the root component.
 * 
 * Algorithm Strategy:
 * No specific algorithmic strategy is implemented in this component as it mainly serves as the entry point of the application.
 * 
 * Params:
 * - Component: Component - Angular decorator to mark the class as an Angular component.
 */
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'frontend';
}
