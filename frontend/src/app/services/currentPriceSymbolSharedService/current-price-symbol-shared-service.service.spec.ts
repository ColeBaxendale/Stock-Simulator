/**
 * Filename: current-price-symbol-shared-service.service.spec.ts
 * Author: Cole Baxendale
 * Contact: thecodercole@gmail.com
 * Creation Date: February 2024
 * Version: 1.0
 * Description: This file contains the unit tests for the CurrentPriceSymbolSharedServiceService
 * in an Angular application. It aims to test the service's initialization and verify its
 * functionality within the testing environment provided by Angular's TestBed. The tests ensure
 * that the service is properly created and can be injected into components or other services,
 * supporting the development and maintenance of reliable and robust applications.
 */

import { TestBed } from '@angular/core/testing';

import { CurrentPriceSymbolSharedServiceService } from './current-price-symbol-shared-service.service';

describe('CurrentPriceSymbolSharedServiceService', () => {
  let service: CurrentPriceSymbolSharedServiceService;

  beforeEach(() => {
    // Before each test, configure the testing module to initialize the service's environment.
    // This setup step is crucial for isolating the service testing from other parts of the application.
    TestBed.configureTestingModule({});
    // Inject the service into the test environment to verify its instantiation and functionality.
    service = TestBed.inject(CurrentPriceSymbolSharedServiceService);
  });

  // Define a test case to ensure the service is created successfully.
  // This test verifies the service's injectability and existence within the Angular application.
  it('should be created', () => {
    expect(service).toBeTruthy(); // Expect the service instance to be truthy, indicating successful creation.
  });
});
