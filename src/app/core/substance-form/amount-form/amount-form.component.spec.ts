import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountFormComponent } from './amount-form.component';

describe('CountAmountFormComponent', () => {
  let component: AmountFormComponent;
  let fixture: ComponentFixture<AmountFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmountFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
