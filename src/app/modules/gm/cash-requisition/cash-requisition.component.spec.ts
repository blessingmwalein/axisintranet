import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRequisitionComponent } from './cash-requisition.component';

describe('CashRequisitionComponent', () => {
  let component: CashRequisitionComponent;
  let fixture: ComponentFixture<CashRequisitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashRequisitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
