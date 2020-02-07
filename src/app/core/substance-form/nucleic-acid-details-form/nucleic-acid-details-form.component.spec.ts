import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NucleicAcidDetailsFormComponent } from './nucleic-acid-details-form.component';

describe('NucleicAcidDetailsFormComponent', () => {
  let component: NucleicAcidDetailsFormComponent;
  let fixture: ComponentFixture<NucleicAcidDetailsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NucleicAcidDetailsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NucleicAcidDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
