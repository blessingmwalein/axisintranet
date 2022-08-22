import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCardReqComponent } from './create-card-req.component';

describe('CreateCardReqComponent', () => {
  let component: CreateCardReqComponent;
  let fixture: ComponentFixture<CreateCardReqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCardReqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCardReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
