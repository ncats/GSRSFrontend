import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormStructurallyDiverseSourceComponent } from './substance-form-structurally-diverse-source.component';

describe('SubstanceFormStructurallyDiverseSourceComponent', () => {
  let component: SubstanceFormStructurallyDiverseSourceComponent;
  let fixture: ComponentFixture<SubstanceFormStructurallyDiverseSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormStructurallyDiverseSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormStructurallyDiverseSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
