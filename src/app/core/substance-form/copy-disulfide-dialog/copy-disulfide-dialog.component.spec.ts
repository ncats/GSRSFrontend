import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { vi } from 'vitest';

import { CopyDisulfideDialogComponent } from './copy-disulfide-dialog.component';

describe('CopyDisulfideDialogComponent', () => {
  let component: CopyDisulfideDialogComponent;
  let fixture: ComponentFixture<CopyDisulfideDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyDisulfideDialogComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        // constructor sets dialogRef.disableClose; ngOnInit reads data.full.sequence and
        // subscribes to subService.substanceSubunits (an Observable property, not a method).
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: { unit: {}, full: { sequence: '' } } },
        {
          provide: SubstanceFormService,
          useValue: { substanceSubunits: of([]), copyDisulfideLinks: () => {} }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyDisulfideDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
