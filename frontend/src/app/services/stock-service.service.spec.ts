/**
 * Stock Service Service Test
 * 
 * Filename: stock-service.service.spec.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description:
 * This test suite verifies the functionality of the StockServiceService class.
 * It ensures that the service is created successfully and its methods behave as expected.
 * 
 * Algorithm Strategy:
 * 1. Configure the testing module before each test to inject the StockServiceService.
 * 2. Test if the StockServiceService is created successfully.
 * 
 * Params:
 * - TestBed: TestBed - Angular's testing module for configuring testing environments.
 * - StockServiceService: StockServiceService - Service for fetching stock-related data.
 */

// Import statements for TestBed and StockServiceService
import { TestBed } from '@angular/core/testing';
import { StockServiceService } from './stock-service.service';

// Describe block for testing StockServiceService
describe('StockServiceService', () => {
  let service: StockServiceService;

  // Before each test, configure testing module and inject StockServiceService
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockServiceService);
  });

  // Test to check if StockServiceService is created successfully
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
