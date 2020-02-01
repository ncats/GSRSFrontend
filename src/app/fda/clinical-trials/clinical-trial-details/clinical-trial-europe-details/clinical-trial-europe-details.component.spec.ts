import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalTrialEuropeDetailsComponent } from './clinical-trial-europe-details.component';

describe('ClinicalTrialEuropeDetailsComponent', () => {
  let component: ClinicalTrialEuropeDetailsComponent;
  let fixture: ComponentFixture<ClinicalTrialEuropeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicalTrialEuropeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalTrialEuropeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
