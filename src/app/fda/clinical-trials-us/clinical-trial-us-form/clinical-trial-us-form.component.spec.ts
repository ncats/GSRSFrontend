import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalTrialUSFormComponent } from './clinical-trial-us-form.component';

describe('ClinicalTrialUSFormComponent', () => {
  let component: ClinicalTrialUSFormComponent;
  let fixture: ComponentFixture<ClinicalTrialUSFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicalTrialUSFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalTrialUSFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
