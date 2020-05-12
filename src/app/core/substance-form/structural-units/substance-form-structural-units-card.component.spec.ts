import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormStructuralUnitsCardComponent } from './substance-form-structural-units-card.component';

describe('SubstanceFormStructuralUnitsComponent', () => {
  let component: SubstanceFormStructuralUnitsCardComponent;
  let fixture: ComponentFixture<SubstanceFormStructuralUnitsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormStructuralUnitsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormStructuralUnitsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
