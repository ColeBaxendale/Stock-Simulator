/**
 * Filename: snackbar-popup.service.spec.ts
 * Author: Cole Baxendale
 * Contact: thecodercole@gmail.com
 * Creation Date: February 2024
 * Version: 1.0
 * Description: This test suite is designed to perform unit testing on the SnackBarPopUpService within an Angular application.
 * It ensures that the SnackBarPopUpService is properly created and can be injected using Angular's dependency injection system.
 * The TestBed utility from Angular Core Testing is used to configure and initialize the environment for unit testing this service.
 */

import { TestBed } from '@angular/core/testing';

// Import the service that will be tested.
import { SnackBarPopUpService } from './snack-bar-pop-up.service';

// Describe function defines a test suite for the SnackBarPopUpService.
describe('SnackBarPopUpService', () => {
  // Declare a variable to hold the instance of SnackBarPopUpService.
  let service: SnackBarPopUpService;

  beforeEach(() => {
    // Before each test, initialize the testing module environment.
    TestBed.configureTestingModule({});
    // Inject the SnackBarPopUpService into the test environment, making it available for testing.
    service = TestBed.inject(SnackBarPopUpService);
  });

  // Define an individual test case to verify that the service is created successfully.
  it('should be created', () => {
    // Use the expect function to assert that the service instance is truthy, indicating it was created successfully.
    expect(service).toBeTruthy();
  });
});
