/**
 * Stock Page Component
 * 
 * Filename: stock-page.component.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description: 
 * This component represents the page for displaying detailed information about a 
 * specific stock. It includes data such as the current price, historical performance, 
 * and relevant news articles related to the stock. Users can view this page to get 
 * insights into the performance and trends of individual stocks.
 */

// Import necessary modules for testing
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Import the component to be tested
import { StockPageComponent } from './stock-page.component';

// Test suite for StockPageComponent
describe('StockPageComponent', () => {
  let component: StockPageComponent;
  let fixture: ComponentFixture<StockPageComponent>;

  // Set up testing environment before each test case
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockPageComponent] // Declare the component to be tested
    }).compileComponents(); // Compile the component and its template
    // Create an instance of the component
    fixture = TestBed.createComponent(StockPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger change detection
  });

  // Test case to check if the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy(); // Expect the component to be truthy
  });
});
