import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormMixtureComponentsCardComponent } from './substance-form-mixture-components-card.component';

describe('SubstanceFormMixtureComponentsComponent', () => {
  let component: SubstanceFormMixtureComponentsCardComponent;
  let fixture: ComponentFixture<SubstanceFormMixtureComponentsCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormMixtureComponentsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormMixtureComponentsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
