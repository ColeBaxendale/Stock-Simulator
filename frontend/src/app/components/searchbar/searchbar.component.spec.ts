/**
 * Searchbar Component
 * 
 * Filename: searchbar.component.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description: 
 * This component represents the search bar feature of the application. It allows users 
 * to search for stocks using keywords. The component sends HTTP requests to the server 
 * to fetch search results based on the entered keywords. It utilizes Angular Material 
 * for UI elements and interacts with the StockService for fetching search results.
 * 
 * Params: None
 * Time Complexity: O(1)
 * Algorithm Strategy: The component initializes the search functionality and listens 
 * for user input events. When a user enters keywords, the component sends an HTTP 
 * request to the server to fetch search results. The algorithm ensures quick and 
 * responsive searching with constant time complexity.
 * 
 */

// Import necessary testing modules from Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Import the component to be tested
import { SearchbarComponent } from './searchbar.component';

// Describe a test suite for the SearchbarComponent
describe('SearchbarComponent', () => {
  let component: SearchbarComponent; // Declare a variable to hold the component instance
  let fixture: ComponentFixture<SearchbarComponent>; // Declare a variable to hold the component fixture

  // Run this block of code before each test case
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchbarComponent] // Declare the component under test
    })
    .compileComponents(); // Compile the component template and styles asynchronously
    
    // Create a component fixture for the SearchbarComponent
    fixture = TestBed.createComponent(SearchbarComponent);
    
    // Retrieve the component instance from the fixture
    component = fixture.componentInstance;
    
    // Trigger change detection to initialize the component
    fixture.detectChanges();
  });

  // Test case: Check if the component is created successfully
  it('should create', () => {
    // Assert that the component instance exists (not null or undefined)
    expect(component).toBeTruthy();
  });
});
