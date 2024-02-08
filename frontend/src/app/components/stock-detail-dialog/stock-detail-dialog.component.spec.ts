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
 * This component represents the dialog that displays detailed information 
 * about a stock when selected from the search results. It utilizes Angular Material 
 * for dialog functionality and communicates with other components to display 
 * relevant data about the selected stock.
 * 
 * 
 * Algorithm Strategy:
 * 1. Utilize TestBed to configure and create a testing module for the StockDetailDialogComponent.
 * 2. Use ComponentFixture to create an instance of the StockDetailDialogComponent and obtain its fixture.
 * 3. Trigger change detection to initialize the component.
 * 4. Test if the component is created successfully by expecting it to be truthy (not null or undefined).
 * 
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockDetailDialogComponent } from './stock-detail-dialog.component';

describe('StockDetailDialogComponent', () => {
  let component: StockDetailDialogComponent;
  let fixture: ComponentFixture<StockDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockDetailDialogComponent] // Declare the component
    })
    .compileComponents(); // Compile the component and its template
    
    fixture = TestBed.createComponent(StockDetailDialogComponent); // Create an instance of the component
    component = fixture.componentInstance; // Get the component instance
    fixture.detectChanges(); // Trigger change detection
  });

  /**
   * Test if the component is created successfully
   */
  it('should create', () => {
    expect(component).toBeTruthy(); // Expect the component to be truthy (not null or undefined)
  });
});
