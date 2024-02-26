/*
-----------------------------------------------------------------------
Filename: forgot-password.component.spec.ts
Author: Cole Baxendale
Contact: thecodercole@gmail.com
Creation Date: February 2024
Version: 1.0

Description:
This file contains unit tests for the ForgotPasswordComponent class using Angular's TestBed and Jasmine testing framework.

Testing:
- The 'should create' test checks if the component instance is created successfully.

Note: Additional tests can be added as needed to cover more functionality.
-----------------------------------------------------------------------
*/

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
