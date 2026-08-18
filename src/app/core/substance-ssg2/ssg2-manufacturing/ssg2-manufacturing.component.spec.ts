import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NEVER } from 'rxjs';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceFormSsg2ManufacturingService } from './substance-form-ssg2-manufacturing.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';

import { Ssg2ManufacturingComponent } from './ssg2-manufacturing.component';

describe('Ssg2ManufacturingComponent', () => {
  let component: Ssg2ManufacturingComponent;
  let fixture: ComponentFixture<Ssg2ManufacturingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ssg2ManufacturingComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SubstanceFormService, useValue: { substance: NEVER } },
        { provide: SubstanceFormSsg2ManufacturingService, useValue: {} },
        { provide: GoogleAnalyticsService, useValue: { sendEvent: () => null } },
        { provide: ControlledVocabularyService, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ssg2ManufacturingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
