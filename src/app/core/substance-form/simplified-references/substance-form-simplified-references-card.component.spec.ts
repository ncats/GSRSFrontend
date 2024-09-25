import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormSimplifiedReferencesCardComponent } from './substance-form-simplified-references-card.component';

describe('SubstanceFormSimplifiedReferencesCardComponent', () => {
  let component: SubstanceFormSimplifiedReferencesCardComponent;
  let fixture: ComponentFixture<SubstanceFormSimplifiedReferencesCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormSimplifiedReferencesCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormSimplifiedReferencesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
