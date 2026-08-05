import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvTermDialogComponent } from './cv-term-dialog.component';

describe('CvTermDialogComponent', () => {
  let component: CvTermDialogComponent;
  let fixture: ComponentFixture<CvTermDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CvTermDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvTermDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
