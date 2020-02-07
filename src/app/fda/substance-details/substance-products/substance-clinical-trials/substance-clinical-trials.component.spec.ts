import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceClinicalTrialsComponent } from './substance-clinical-trials.component';

describe('SubstanceClinicalTrialsComponent', () => {
  let component: SubstanceClinicalTrialsComponent;
  let fixture: ComponentFixture<SubstanceClinicalTrialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceClinicalTrialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceClinicalTrialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
