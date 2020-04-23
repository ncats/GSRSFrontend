import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormConstituentsCardComponent } from './substance-form-constituents-card.component';

describe('SubstanceFormConstituentsComponent', () => {
  let component: SubstanceFormConstituentsCardComponent;
  let fixture: ComponentFixture<SubstanceFormConstituentsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormConstituentsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormConstituentsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
