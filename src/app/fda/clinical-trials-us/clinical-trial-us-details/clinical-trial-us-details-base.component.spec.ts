import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalTrialUSDetailsBaseComponent } from './clinical-trial-us-details-base.component';

describe('ClinicalTrialUSDetailsBaseComponent', () => {
  let component: ClinicalTrialUSDetailsBaseComponent;
  let fixture: ComponentFixture<ClinicalTrialUSDetailsBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicalTrialUSDetailsBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalTrialUSDetailsBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
