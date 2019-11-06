import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvDialogComponent } from './cv-dialog.component';

describe('CvDialogComponent', () => {
  let component: CvDialogComponent;
  let fixture: ComponentFixture<CvDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
