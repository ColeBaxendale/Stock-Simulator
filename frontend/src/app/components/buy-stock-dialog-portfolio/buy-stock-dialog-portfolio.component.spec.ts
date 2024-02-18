import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyStockDialogPortfolioComponent } from './buy-stock-dialog-portfolio.component';

describe('BuyStockDialogPortfolioComponent', () => {
  let component: BuyStockDialogPortfolioComponent;
  let fixture: ComponentFixture<BuyStockDialogPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyStockDialogPortfolioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuyStockDialogPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
