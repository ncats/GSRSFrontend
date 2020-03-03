import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceStructuralUnitsComponent } from './substance-structural-units.component';

describe('SubstanceStructuralUnitsComponent', () => {
  let component: SubstanceStructuralUnitsComponent;
  let fixture: ComponentFixture<SubstanceStructuralUnitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceStructuralUnitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceStructuralUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
