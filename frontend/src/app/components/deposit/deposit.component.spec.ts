/*
-----------------------------------------------------------------------
Filename: deposit.component.spec.ts
Author: Cole Baxendale
Contact: thecodercole@gmail.com
Creation Date: February 2024
Version: 1.0

Description:
This file contains unit tests for the DepositComponent class using Angular's TestBed and Jasmine testing framework.

Testing:
- The 'should create' test checks if the component instance is created successfully.

Note: Additional tests can be added as needed to cover more functionality.
-----------------------------------------------------------------------
*/

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositComponent } from './deposit.component';

describe('DepositComponent', () => {
  let component: DepositComponent;
  let fixture: ComponentFixture<DepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepositComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
