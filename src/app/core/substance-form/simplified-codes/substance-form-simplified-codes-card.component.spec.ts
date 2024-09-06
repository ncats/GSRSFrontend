import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormSimplifiedCodesCardComponent } from './substance-form-simplified-codes-card.component';

describe('SubstanceFormCodesCardComponent', () => {
  let component: SubstanceFormSimplifiedCodesCardComponent;
  let fixture: ComponentFixture<SubstanceFormSimplifiedCodesCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormSimplifiedCodesCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormSimplifiedCodesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
