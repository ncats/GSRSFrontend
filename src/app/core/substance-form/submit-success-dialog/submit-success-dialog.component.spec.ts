import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitSuccessDialogComponent } from './submit-success-dialog.component';

describe('SubmitSuccessDialogComponent', () => {
  let component: SubmitSuccessDialogComponent;
  let fixture: ComponentFixture<SubmitSuccessDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitSuccessDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitSuccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
