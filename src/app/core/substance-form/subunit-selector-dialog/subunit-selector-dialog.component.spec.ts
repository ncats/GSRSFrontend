import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, NEVER } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceFormLinksService } from '@gsrs-core/substance-form/links/substance-form-links.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { SubunitSelectorDialogComponent } from './subunit-selector-dialog.component';

describe('SubunitSelectorDialogComponent', () => {
  let component: SubunitSelectorDialogComponent;
  let fixture: ComponentFixture<SubunitSelectorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, SubunitSelectorDialogComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {}, afterClosed: () => of(null), backdropClick: () => NEVER } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        {
          provide: SubstanceFormService,
          useValue: {
            definition: NEVER,
            subunitDisplaySequences: NEVER,
            allSites: NEVER,
            substanceSugars: NEVER,
            siteString: () => '',
            stringToSites: () => []
          }
        },
        { provide: SubstanceFormLinksService, useValue: { substanceLinks: NEVER } },
        { provide: GoogleAnalyticsService, useValue: { sendEvent: () => null } },
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => NEVER } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubunitSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
