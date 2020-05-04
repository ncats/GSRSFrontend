import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormStructurallyDiverseOrganismComponent } from './substance-form-structurally-diverse-organism.component';

describe('SubstanceFormStructurallyDiverseOrganismComponent', () => {
  let component: SubstanceFormStructurallyDiverseOrganismComponent;
  let fixture: ComponentFixture<SubstanceFormStructurallyDiverseOrganismComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormStructurallyDiverseOrganismComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormStructurallyDiverseOrganismComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
