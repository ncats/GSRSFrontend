import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NEVER } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ConfigService } from '@gsrs-core/config';
import { UtilsService } from '@gsrs-core/utils';
import { SubstanceFormSsg4mProcessService } from '../ssg4m-process/substance-form-ssg4m-process.service';
import { SubstanceSsg4mService } from '../substance-ssg4m-form.service';

import { Ssg4mSchemeViewComponent } from './ssg4m-scheme-view.component';

describe('Ssg4mSchemeViewComponent', () => {
  let component: Ssg4mSchemeViewComponent;
  let fixture: ComponentFixture<Ssg4mSchemeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ssg4mSchemeViewComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ConfigService, useValue: { configData: {}, environment: {} } },
        { provide: SubstanceFormSsg4mProcessService, useValue: { specifiedSubstanceG4mProcess: NEVER } },
        { provide: SubstanceSsg4mService, useValue: {} },
        { provide: UtilsService, useValue: { displayAmount: () => '' } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => NEVER }) } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ssg4mSchemeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
