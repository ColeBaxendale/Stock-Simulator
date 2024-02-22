import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyStockDialogStockPageComponent } from './buy-stock-dialog-stock-page.component';

describe('BuyStockDialogStockPageComponent', () => {
  let component: BuyStockDialogStockPageComponent;
  let fixture: ComponentFixture<BuyStockDialogStockPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyStockDialogStockPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuyStockDialogStockPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
