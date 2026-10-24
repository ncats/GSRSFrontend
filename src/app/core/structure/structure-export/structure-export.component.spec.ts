import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { vi } from 'vitest';

import { StructureExportComponent } from './structure-export.component';

describe('StructureExportComponent', () => {
  let component: StructureExportComponent;
  let fixture: ComponentFixture<StructureExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ StructureExportComponent ],
      providers: [
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: { molfile: '', smiles: '', type: '' } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
