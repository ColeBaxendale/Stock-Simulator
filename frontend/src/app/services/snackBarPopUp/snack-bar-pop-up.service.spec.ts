import { TestBed } from '@angular/core/testing';

import { SnackBarPopUpService } from './snack-bar-pop-up.service';

describe('SnackBarPopUpService', () => {
  let service: SnackBarPopUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnackBarPopUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
