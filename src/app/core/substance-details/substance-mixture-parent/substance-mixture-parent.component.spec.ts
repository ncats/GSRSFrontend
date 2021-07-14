import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceMixtureParentComponent } from './substance-mixture-parent.component';

describe('SubstanceMixtureParentComponent', () => {
  let component: SubstanceMixtureParentComponent;
  let fixture: ComponentFixture<SubstanceMixtureParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceMixtureParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceMixtureParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
