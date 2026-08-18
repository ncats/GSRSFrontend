import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NEVER, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceFormPropertiesService } from '@gsrs-core/substance-form/properties/substance-form-properties.service';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { ConfigService } from '@gsrs-core/config';

import { Ssg4mCriticalParameterFormComponent } from './ssg4m-critical-parameter-form.component';

describe('Ssg4mCriticalParameterComponent', () => {
  let component: Ssg4mCriticalParameterFormComponent;
  let fixture: ComponentFixture<Ssg4mCriticalParameterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ssg4mCriticalParameterFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SubstanceFormService, useValue: { substance: of({
          specifiedSubstanceG4m: { process: [{ sites: [{ stages: [{ criticalParameters: [{}] }] }] }] }
        }) } },
        { provide: SubstanceFormPropertiesService, useValue: {} },
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => NEVER } },
        { provide: ConfigService, useValue: { configData: {} } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => NEVER }) } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ssg4mCriticalParameterFormComponent);
    component = fixture.componentInstance;
    component.processIndex = 0;
    component.siteIndex = 0;
    component.stageIndex = 0;
    component.criticalParameterIndex = 0;
    component.criticalParameter = { value: {} } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
