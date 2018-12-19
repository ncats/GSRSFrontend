import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceNotesComponent } from './substance-notes.component';

describe('SubstanceNotesComponent', () => {
  let component: SubstanceNotesComponent;
  let fixture: ComponentFixture<SubstanceNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
