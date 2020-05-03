import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormStructureCardComponent } from './substance-form-structure-card.component';

describe('SubstanceFormStructureComponent', () => {
  let component: SubstanceFormStructureCardComponent;
  let fixture: ComponentFixture<SubstanceFormStructureCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormStructureCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormStructureCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
