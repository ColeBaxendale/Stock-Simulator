import { TestBed } from '@angular/core/testing';

import { CurrentPriceSymbolSharedServiceService } from './current-price-symbol-shared-service.service';

describe('CurrentPriceSymbolSharedServiceService', () => {
  let service: CurrentPriceSymbolSharedServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentPriceSymbolSharedServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
