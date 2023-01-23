import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveReqDialogComponent } from './approve-req-dialog.component';

describe('ApproveReqDialogComponent', () => {
  let component: ApproveReqDialogComponent;
  let fixture: ComponentFixture<ApproveReqDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveReqDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveReqDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
