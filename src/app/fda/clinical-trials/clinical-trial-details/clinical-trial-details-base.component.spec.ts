import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalTrialDetailsBaseComponent } from './clinical-trial-details-base.component';

describe('ClinicalTrialDetailsBaseComponent', () => {
  let component: ClinicalTrialDetailsBaseComponent;
  let fixture: ComponentFixture<ClinicalTrialDetailsBaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicalTrialDetailsBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalTrialDetailsBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
