import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantainanceComponent } from './mantainance.component';

describe('MantainanceComponent', () => {
  let component: MantainanceComponent;
  let fixture: ComponentFixture<MantainanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantainanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MantainanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
