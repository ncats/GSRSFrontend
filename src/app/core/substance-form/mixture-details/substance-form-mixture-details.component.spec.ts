import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormMixtureDetailsComponent } from './substance-form-mixture-details.component';

describe('SubstanceFormMixtureDetailsComponent', () => {
  let component: SubstanceFormMixtureDetailsComponent;
  let fixture: ComponentFixture<SubstanceFormMixtureDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormMixtureDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormMixtureDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
