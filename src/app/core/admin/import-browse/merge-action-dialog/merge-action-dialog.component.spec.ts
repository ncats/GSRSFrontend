import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeActionDialogComponent } from './merge-action-dialog.component';

describe('MergeActionDialogComponent', () => {
  let component: MergeActionDialogComponent;
  let fixture: ComponentFixture<MergeActionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergeActionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeActionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
