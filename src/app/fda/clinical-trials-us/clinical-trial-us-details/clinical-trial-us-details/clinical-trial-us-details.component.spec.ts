import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalTrialUSDetailsComponent } from './clinical-trial-us-details.component';

describe('ClinicalTrialUSDetailsComponent', () => {
  let component: ClinicalTrialUSDetailsComponent;
  let fixture: ComponentFixture<ClinicalTrialUSDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicalTrialUSDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalTrialUSDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
