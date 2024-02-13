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
