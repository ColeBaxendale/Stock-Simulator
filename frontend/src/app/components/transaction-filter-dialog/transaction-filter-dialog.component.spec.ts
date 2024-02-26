/*
-----------------------------------------------------------------------
Filename: transaction-filter-dialog.component.spec.ts
Author: Cole Baxendale
Contact: thecodercole@gmail.com
Creation Date: February 2024
Version: 1.0

Description:
This file contains unit tests for the TransactionFilterDialogComponent class using Angular's TestBed and Jasmine testing framework.

Testing:
- The 'should create' test checks if the component instance is created successfully.

Note: Additional tests can be added as needed to cover more functionality.
-----------------------------------------------------------------------
*/

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionFilterDialogComponent } from './transaction-filter-dialog.component';

describe('TransactionFilterDialogComponent', () => {
  let component: TransactionFilterDialogComponent;
  let fixture: ComponentFixture<TransactionFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionFilterDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
