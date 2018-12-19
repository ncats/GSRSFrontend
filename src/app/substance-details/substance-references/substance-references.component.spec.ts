import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceReferencesComponent } from './substance-references.component';

describe('SubstanceReferencesComponent', () => {
  let component: SubstanceReferencesComponent;
  let fixture: ComponentFixture<SubstanceReferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceReferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
