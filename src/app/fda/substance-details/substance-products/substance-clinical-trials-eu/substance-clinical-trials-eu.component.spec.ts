import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceClinicalTrialsEuComponent } from './substance-clinical-trials-eu.component';

describe('SubstanceClinicalTrialsEuComponent', () => {
  let component: SubstanceClinicalTrialsEuComponent;
  let fixture: ComponentFixture<SubstanceClinicalTrialsEuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceClinicalTrialsEuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceClinicalTrialsEuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
