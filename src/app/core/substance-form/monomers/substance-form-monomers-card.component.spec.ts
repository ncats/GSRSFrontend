import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormMonomersComponent } from './substance-form-monomers-card.component';

describe('SubstanceFormCodesComponent', () => {
  let component: SubstanceFormMonomersComponent;
  let fixture: ComponentFixture<SubstanceFormMonomersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormMonomersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormMonomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
