import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDeviceReqComponent } from './create-device-req.component';

describe('CreateDeviceReqComponent', () => {
  let component: CreateDeviceReqComponent;
  let fixture: ComponentFixture<CreateDeviceReqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDeviceReqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDeviceReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
