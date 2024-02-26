/*
-----------------------------------------------------------------------
Filename: stock-buy-sell.service.spec.ts
Author: Cole Baxendale
Contact: thecodercole@gmail.com
Creation Date: February 2024
Version: 1.0

Description:
This file contains unit tests for the StockBuySellService class using Angular's TestBed and Jasmine testing framework.

Testing:
- The 'should be created' test checks if the service instance is created successfully.

Note: Additional tests can be added as needed to cover more functionality.
-----------------------------------------------------------------------
*/

import { TestBed } from '@angular/core/testing';

import { StockBuySellService } from './stock-buy-sell.service';

describe('StockBuySellService', () => {
  let service: StockBuySellService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockBuySellService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
