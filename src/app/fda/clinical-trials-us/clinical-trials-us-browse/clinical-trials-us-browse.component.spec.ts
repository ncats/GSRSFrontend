import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalTrialsUSBrowseComponent } from './clinical-trials-us-browse.component';

describe('ClinicalTrialsUSBrowseComponent', () => {
  let component: ClinicalTrialsUSBrowseComponent;
  let fixture: ComponentFixture<ClinicalTrialsUSBrowseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicalTrialsUSBrowseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalTrialsUSBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
