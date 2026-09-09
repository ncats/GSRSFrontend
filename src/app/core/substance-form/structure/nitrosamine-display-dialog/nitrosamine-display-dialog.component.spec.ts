import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { StructureService } from '@gsrs-core/structure/structure.service';

import { NitrosamineDisplayDialogComponent } from './nitrosamine-display-dialog.component';

describe('NitrosamineDisplayDialogComponent', () => {
  let component: NitrosamineDisplayDialogComponent;
  let fixture: ComponentFixture<NitrosamineDisplayDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ NitrosamineDisplayDialogComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: { structure: { smiles: '' } } },
        // also injected by the real, standalone app-nitrosamine-display child this
        // component's template now renders for real.
        { provide: StructureService, useValue: { smileObservable$: of(null) } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NitrosamineDisplayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
