import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NEVER, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceFormSsg4mStagesService } from '../ssg4m-stages/substance-form-ssg4m-stages.service';
import { UtilsService } from '@gsrs-core/utils';
import { ConfigService } from '@gsrs-core/config';

import { Ssg4mProcessingMaterialsFormComponent } from './ssg4m-processing-materials-form.component';

describe('Ssg4mProcessingMaterialsFormComponent', () => {
  let component: Ssg4mProcessingMaterialsFormComponent;
  let fixture: ComponentFixture<Ssg4mProcessingMaterialsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ssg4mProcessingMaterialsFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SubstanceFormService, useValue: { substance: of({
          specifiedSubstanceG4m: { process: [{ sites: [{ stages: [{ processingMaterials: [{}] }] }] }] }
        }) } },
        { provide: SubstanceFormSsg4mStagesService, useValue: {} },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: UtilsService, useValue: {} },
        { provide: ConfigService, useValue: { configData: {} } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => NEVER }) } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ssg4mProcessingMaterialsFormComponent);
    component = fixture.componentInstance;
    component.processIndex = 0;
    component.siteIndex = 0;
    component.stageIndex = 0;
    component.processingMaterialIndex = 0;
    component.processingMaterial = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
