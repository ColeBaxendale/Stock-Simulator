import { TestBed } from '@angular/core/testing';

import { PorfolioProfitLoss } from './portfolio-profitloss.service';

describe('PortfolioProfitlossService', () => {
  let service: PorfolioProfitLoss;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PorfolioProfitLoss);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
