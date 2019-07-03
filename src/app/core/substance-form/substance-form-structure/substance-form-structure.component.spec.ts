import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormStructureComponent } from './substance-form-structure.component';

describe('SubstanceFormStructureComponent', () => {
  let component: SubstanceFormStructureComponent;
  let fixture: ComponentFixture<SubstanceFormStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormStructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
