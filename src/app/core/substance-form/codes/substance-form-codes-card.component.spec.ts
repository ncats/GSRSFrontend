import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormCodesCardComponent } from './substance-form-codes-card.component';

describe('SubstanceFormCodesCardComponent', () => {
  let component: SubstanceFormCodesCardComponent;
  let fixture: ComponentFixture<SubstanceFormCodesCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormCodesCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormCodesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
