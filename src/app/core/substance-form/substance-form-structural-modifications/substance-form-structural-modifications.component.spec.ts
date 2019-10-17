import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormStructuralModificationsComponent } from './substance-form-structural-modifications.component';

describe('SubstanceFormStructuralModificationsComponent', () => {
  let component: SubstanceFormStructuralModificationsComponent;
  let fixture: ComponentFixture<SubstanceFormStructuralModificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormStructuralModificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormStructuralModificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
