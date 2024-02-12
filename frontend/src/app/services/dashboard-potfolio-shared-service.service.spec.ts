/**
 * Unit Test for DashboardPortfolioSharedService
 * 
 * Filename: dashboard-potfolio-shared-service.service.spec.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Purpose:
 * This test suite is designed to verify the creation and functionality of the DashboardPortfolioSharedService,
 * which facilitates the sharing of the total profit/loss data between the Dashboard and Portfolio components
 * within the application. It ensures the service is correctly instantiated and its methods perform as expected.
 *
 * Features Tested:
 * - Service creation: Tests if the Angular service is successfully created.
 * - Functionality: While this suite primarily focuses on service instantiation,
 *   additional tests can be added to verify the behavior of methods such as updateProfitLoss.
 *
 * Implementation Details:
 * - The TestBed utility from Angular's core testing library is used to configure the testing environment,
 *   allowing for the injection of the DashboardPortfolioSharedService.
 * - The 'it' blocks define individual test cases, starting with the basic existence check of the service.
 *
 * Usage:
 * This test suite is executed as part of the application's test command, typically run via Angular CLI
 * or integrated into continuous integration (CI) workflows. It aids in maintaining code quality and
 * ensuring that changes to the DashboardPortfolioSharedService do not introduce regressions.
 *
 */

import { TestBed } from '@angular/core/testing';

import { DashboardPotfolioSharedServiceService } from './dashboard-potfolio-shared-service.service';

describe('DashboardPotfolioSharedServiceService', () => {
  let service: DashboardPotfolioSharedServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardPotfolioSharedServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
