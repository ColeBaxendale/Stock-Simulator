/*
-----------------------------------------------------------------------
Filename: buy-stock-dialog-stock-page.component.spec.ts
Author: Cole Baxendale
Contact: thecodercole@gmail.com
Creation Date: February 2024
Version: 1.0

Description:
This file contains unit tests for the BuyStockDialogStockPageComponent class using Angular's TestBed and Jasmine testing framework.

Testing:
- The 'should create' test checks if the component instance is created successfully.

Note: Additional tests can be added as needed to cover more functionality.
-----------------------------------------------------------------------
*/

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
