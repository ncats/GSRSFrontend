import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalTrialUSSubstanceFormComponent } from './clinical-trial-us-substance-form.component';

describe('ClinicalTrialUSSubstanceFormComponent', () => {
  let component: ClinicalTrialUSSubstanceFormComponent;
  let fixture: ComponentFixture<ClinicalTrialUSSubstanceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicalTrialUSSubstanceFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalTrialUSSubstanceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
