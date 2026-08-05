import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeConceptDialogComponent } from './merge-concept-dialog.component';

describe('MergeConceptDialogComponent', () => {
  let component: MergeConceptDialogComponent;
  let fixture: ComponentFixture<MergeConceptDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MergeConceptDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeConceptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
