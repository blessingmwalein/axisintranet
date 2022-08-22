import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCashReqComponent } from './create-cash-req.component';

describe('CreateCashReqComponent', () => {
  let component: CreateCashReqComponent;
  let fixture: ComponentFixture<CreateCashReqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCashReqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCashReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
