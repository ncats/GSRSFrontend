import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormReferencesComponent } from './substance-form-references-card.component';

describe('SubstanceFormReferencesComponent', () => {
  let component: SubstanceFormReferencesComponent;
  let fixture: ComponentFixture<SubstanceFormReferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormReferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
