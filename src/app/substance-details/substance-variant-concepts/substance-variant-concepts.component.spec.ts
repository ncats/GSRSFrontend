import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceVariantConceptsComponent } from './substance-variant-concepts.component';

describe('SubstanceVariantConceptsComponent', () => {
  let component: SubstanceVariantConceptsComponent;
  let fixture: ComponentFixture<SubstanceVariantConceptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceVariantConceptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceVariantConceptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
