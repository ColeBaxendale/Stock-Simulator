import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityQuestionsDialogComponent } from './security-questions-dialog.component';

describe('SecurityQuestionsDialogComponent', () => {
  let component: SecurityQuestionsDialogComponent;
  let fixture: ComponentFixture<SecurityQuestionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecurityQuestionsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecurityQuestionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
