import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormStructuralUnitsComponent } from './substance-form-structural-units.component';

describe('SubstanceFormStructuralUnitsComponent', () => {
  let component: SubstanceFormStructuralUnitsComponent;
  let fixture: ComponentFixture<SubstanceFormStructuralUnitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormStructuralUnitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormStructuralUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
