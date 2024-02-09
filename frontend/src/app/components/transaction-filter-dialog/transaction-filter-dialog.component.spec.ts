import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionFilterDialogComponent } from './transaction-filter-dialog.component';

describe('TransactionFilterDialogComponent', () => {
  let component: TransactionFilterDialogComponent;
  let fixture: ComponentFixture<TransactionFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionFilterDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
