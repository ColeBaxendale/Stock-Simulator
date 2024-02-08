/**
 * Login Component
 * 
 * Filename: login.component.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description: 
 * This component represents the login page of the application. It provides a form
 * for users to input their credentials and authenticate themselves. The component 
 * handles user input validation and communicates with the authentication service 
 * to verify user credentials and initiate login procedures.
 * 
 * Algorithm Strategy:
 * 1. Initialize the component and its properties, including form controls for user input.
 * 2. Implement methods to handle form submission, user authentication, and navigation.
 * 3. Utilize Angular's reactive forms module for input validation and form control.
 * 4. Communicate with the authentication service to verify user credentials.
 * 
 * Params:
 * - ComponentFixture: ComponentFixture<LoginComponent> - Fixture for testing the LoginComponent.
 * - TestBed: TestBed - Angular testing module configuration.
 */

// Import necessary modules for testing
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Import the component to be tested
import { LoginComponent } from './login.component';

// Describe the test suite for the LoginComponent
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  // Set up asynchronous beforeEach block to configure TestBed
  beforeEach(async () => {
    // Configure the testing module
    await TestBed.configureTestingModule({
      declarations: [LoginComponent] // Declare the component to be tested
    })
    .compileComponents(); // Compile the component and its template

    // Create a new instance of the component within the testing environment
    fixture = TestBed.createComponent(LoginComponent);
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
