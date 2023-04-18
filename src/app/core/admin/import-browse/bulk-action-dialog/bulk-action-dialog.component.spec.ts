import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkActionDialogComponent } from './bulk-action-dialog.component';

describe('BulkActionDialogComponent', () => {
  let component: BulkActionDialogComponent;
  let fixture: ComponentFixture<BulkActionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkActionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkActionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
