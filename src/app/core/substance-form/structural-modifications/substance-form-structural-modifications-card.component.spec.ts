import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormStructuralModificationsCardComponent } from './substance-form-structural-modifications-card.component';

describe('SubstanceFormStructuralModificationsComponent', () => {
  let component: SubstanceFormStructuralModificationsCardComponent;
  let fixture: ComponentFixture<SubstanceFormStructuralModificationsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormStructuralModificationsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormStructuralModificationsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
