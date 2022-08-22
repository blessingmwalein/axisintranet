import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVehicleReqComponent } from './create-vehicle-req.component';

describe('CreateVehicleReqComponent', () => {
  let component: CreateVehicleReqComponent;
  let fixture: ComponentFixture<CreateVehicleReqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateVehicleReqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVehicleReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
