import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalTrialDetailsComponent } from './clinical-trial-details.component';

describe('ClinicalTrialDetailsComponent', () => {
  let component: ClinicalTrialDetailsComponent;
  let fixture: ComponentFixture<ClinicalTrialDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicalTrialDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalTrialDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
