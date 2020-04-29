import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormNotesComponent } from './substance-form-notes-card.component';

describe('SubstanceFormNotesComponent', () => {
  let component: SubstanceFormNotesComponent;
  let fixture: ComponentFixture<SubstanceFormNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
