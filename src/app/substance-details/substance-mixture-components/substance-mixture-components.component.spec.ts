import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceMixtureComponentsComponent } from './substance-mixture-components.component';

describe('SubstanceMixtureComponentsComponent', () => {
  let component: SubstanceMixtureComponentsComponent;
  let fixture: ComponentFixture<SubstanceMixtureComponentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceMixtureComponentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceMixtureComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
