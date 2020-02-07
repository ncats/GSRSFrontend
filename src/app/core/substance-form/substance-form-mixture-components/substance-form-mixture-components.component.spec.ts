import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormMixtureComponentsComponent } from './substance-form-mixture-components.component';

describe('SubstanceFormMixtureComponentsComponent', () => {
  let component: SubstanceFormMixtureComponentsComponent;
  let fixture: ComponentFixture<SubstanceFormMixtureComponentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormMixtureComponentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormMixtureComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
