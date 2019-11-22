import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormSugarsComponent } from './substance-form-sugars.component';

describe('SubstanceFormSugarsComponent', () => {
  let component: SubstanceFormSugarsComponent;
  let fixture: ComponentFixture<SubstanceFormSugarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormSugarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormSugarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
