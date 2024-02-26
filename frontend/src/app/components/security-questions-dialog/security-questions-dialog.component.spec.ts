/*
-----------------------------------------------------------------------
Filename: security-questions-dialog.component.spec.ts
Author: Cole Baxendale
Contact: thecodercole@gmail.com
Creation Date: February 2024
Version: 1.0

Description:
This file contains unit tests for the SecurityQuestionsDialogComponent class using Angular's TestBed and Jasmine testing framework.

Testing:
- The 'should create' test checks if the component instance is created successfully.

Note: Additional tests can be added as needed to cover more functionality.
-----------------------------------------------------------------------
*/

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityQuestionsDialogComponent } from './security-questions-dialog.component';

describe('SecurityQuestionsDialogComponent', () => {
  let component: SecurityQuestionsDialogComponent;
  let fixture: ComponentFixture<SecurityQuestionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecurityQuestionsDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SecurityQuestionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
