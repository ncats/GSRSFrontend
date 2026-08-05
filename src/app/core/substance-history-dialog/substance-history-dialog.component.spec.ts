import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceHistoryDialogComponent } from './substance-history-dialog.component';

describe('SubstanceHistoryDialogComponent', () => {
  let component: SubstanceHistoryDialogComponent;
  let fixture: ComponentFixture<SubstanceHistoryDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceHistoryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
