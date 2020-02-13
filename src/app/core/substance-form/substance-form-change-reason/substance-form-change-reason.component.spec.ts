import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormChangeReasonComponent } from './substance-form-change-reason.component';

describe('SubstanceFormChangeReasonComponent', () => {
  let component: SubstanceFormChangeReasonComponent;
  let fixture: ComponentFixture<SubstanceFormChangeReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormChangeReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormChangeReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
