import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanDeactivateProductFormComponent } from './can-deactivate-clinical-trial-us-form.component';

describe('CanDeactivateClinicalTrialUSFormComponent', () => {
  let component: CanDeactivateClinicalTrialUSFormComponent;
  let fixture: ComponentFixture<CanDeactivateClinicalTrialUSFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanDeactivateClinicalTrialUSFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanDeactivateClinicalTrialUSFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
