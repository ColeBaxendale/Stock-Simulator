import { TestBed } from '@angular/core/testing';

import { StockSharedServiceService } from './stock-shared-service.service';

describe('StockSharedServiceService', () => {
  let service: StockSharedServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockSharedServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
