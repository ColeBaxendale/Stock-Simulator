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
 * 
 * Algorithm Strategy:
 * 1. Initialize the component and its properties.
 * 2. Implement methods to handle user actions, such as navigating to other pages.
 * 3. Utilize Angular's router to navigate to different routes within the application.
 * 
 * Params:
 * - ComponentFixture: ComponentFixture - Angular testing fixture for component testing.
 * - TestBed: TestBed - Angular testing utility for configuring testing modules.
 */

// Import necessary modules for testing
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Import the component to be tested
import { PageNotFoundComponent } from './page-not-found.component';

// Describe the test suite for the PageNotFoundComponent
describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;

  // Set up asynchronous beforeEach block to configure TestBed
  beforeEach(async () => {
    // Configure the testing module
    await TestBed.configureTestingModule({
      declarations: [PageNotFoundComponent] // Declare the component to be tested
    })
    .compileComponents(); // Compile the component and its template

    // Create a new instance of the component within the testing environment
    fixture = TestBed.createComponent(PageNotFoundComponent);
    // Retrieve the component instance
    component = fixture.componentInstance;
    // Trigger change detection to update the component's view
    fixture.detectChanges();
  });

  // Test case to check if the component is created successfully
  it('should create', () => {
    // Expect the component instance to be truthy, indicating it has been successfully created
    expect(component).toBeTruthy();
  });
});
