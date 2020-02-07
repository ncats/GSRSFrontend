import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormConstituentsComponent } from './substance-form-constituents.component';

describe('SubstanceFormConstituentsComponent', () => {
  let component: SubstanceFormConstituentsComponent;
  let fixture: ComponentFixture<SubstanceFormConstituentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormConstituentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormConstituentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
