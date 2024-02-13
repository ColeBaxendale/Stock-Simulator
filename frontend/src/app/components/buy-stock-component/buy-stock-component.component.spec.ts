import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyStockComponentComponent } from './buy-stock-component.component';

describe('BuyStockComponentComponent', () => {
  let component: BuyStockComponentComponent;
  let fixture: ComponentFixture<BuyStockComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyStockComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuyStockComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
