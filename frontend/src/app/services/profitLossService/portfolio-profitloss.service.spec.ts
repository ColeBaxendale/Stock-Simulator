import { TestBed } from '@angular/core/testing';

import { PorfolioProfitLoss } from './portfolio-profitloss.service';

/**
 * Test Suite: PortfolioProfitLoss Service
 * 
 * Filename: portfolio-profitloss.service.spec.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description: 
 * This file contains the test suite for the PorfolioProfitLoss service. It aims to test the functionality
 * and reliability of the PorfolioProfitLoss service to ensure it operates correctly within the application.
 * The suite includes tests to verify the creation of the service and potentially other operations critical
 * to the service's functionality. This ensures the service correctly manages the total portfolio value and 
 * loading state across the application.
 * 
 * Test Strategy:
 * - Initialization test to confirm the service is correctly created and injectable.
 * - (Further tests can be added here to cover methods like updatetotalPortfolioValue and setLoading, ensuring they
 *    correctly update the BehaviorSubjects and that these updates are emitted to subscribers.)
 */

describe('PortfolioProfitlossService', () => {
  let service: PorfolioProfitLoss;

  beforeEach(() => {
    TestBed.configureTestingModule({}); // Set up TestBed with necessary configurations for the service
    service = TestBed.inject(PorfolioProfitLoss); // Inject the service to be tested
  });

  it('should be created', () => {
    // Expectation to ensure the service instance is created successfully
    expect(service).toBeTruthy();
  });

  // Additional tests can be added here to cover more specific functionalities of the service
});
