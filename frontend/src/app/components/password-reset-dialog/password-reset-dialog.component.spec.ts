/*
-----------------------------------------------------------------------
Filename: password-reset-dialog.component.spec.ts
Author: Cole Baxendale
Contact: thecodercole@gmail.com
Creation Date: February 2024
Version: 1.0

Description:
This file contains unit tests for the PasswordResetDialogComponent class using Angular's TestBed and Jasmine testing framework.

Testing:
- The 'should create' test checks if the component instance is created successfully.

Note: Additional tests can be added as needed to cover more functionality.
-----------------------------------------------------------------------
*/

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetDialogComponent } from './password-reset-dialog.component';

describe('PasswordResetDialogComponent', () => {
  let component: PasswordResetDialogComponent;
  let fixture: ComponentFixture<PasswordResetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordResetDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordResetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
