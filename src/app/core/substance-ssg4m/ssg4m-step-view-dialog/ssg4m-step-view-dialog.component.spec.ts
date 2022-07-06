import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ssg4mStepViewDialogComponent } from './ssg4m-step-view-dialog.component';

describe('Ssg4mStepViewDialogComponent', () => {
  let component: Ssg4mStepViewDialogComponent;
  let fixture: ComponentFixture<Ssg4mStepViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ssg4mStepViewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ssg4mStepViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
