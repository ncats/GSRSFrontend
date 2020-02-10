import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormCodesComponent } from './substance-form-codes.component';

describe('SubstanceFormCodesComponent', () => {
  let component: SubstanceFormCodesComponent;
  let fixture: ComponentFixture<SubstanceFormCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
