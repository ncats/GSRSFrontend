import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountFormDialogComponent } from './amount-form-dialog.component';

describe('AmountFormDialogComponent', () => {
  let component: AmountFormDialogComponent;
  let fixture: ComponentFixture<AmountFormDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmountFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmountFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
