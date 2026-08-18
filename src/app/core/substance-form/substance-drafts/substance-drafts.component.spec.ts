import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceService } from '@gsrs-core/substance';
import { UtilsService } from '@gsrs-core/utils';

import { SubstanceDraftsComponent } from './substance-drafts.component';

describe('SubstanceDraftsComponent', () => {
  let component: SubstanceDraftsComponent;
  let fixture: ComponentFixture<SubstanceDraftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceDraftsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SubstanceFormService, useValue: { cleanSubstance: () => ({ uuid: 'test-uuid', names: [] }) } },
        { provide: SubstanceService, useValue: {} },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: UtilsService, useValue: {} },
        { provide: DomSanitizer, useValue: { bypassSecurityTrustUrl: (v: any) => v } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: MAT_DIALOG_DATA, useValue: { view: 'user' } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceDraftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
