import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminService } from '@gsrs-core/admin/admin.service';

import { ImportScrubberComponent } from './import-scrubber.component';

describe('ImportScrubberComponent', () => {
  let component: ImportScrubberComponent;
  let fixture: ComponentFixture<ImportScrubberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportScrubberComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: AdminService, useValue: {} },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: { scrubberSchema: {}, scrubberModel: {} } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportScrubberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
