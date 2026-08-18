import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, NEVER } from 'rxjs';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceFormReferencesService } from '@gsrs-core/substance-form/references/substance-form-references.service';
import { SubstanceFormNamesService } from '@gsrs-core/substance-form/names/substance-form-names.service';
import { SubstanceFormCodesService } from '@gsrs-core/substance-form/codes/substance-form-codes.service';
import { SubstanceFormStructureService } from '@gsrs-core/substance-form/structure/substance-form-structure.service';
import { MatDialog } from '@angular/material/dialog';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SubstanceFormSimplifiedReferencesCardComponent } from './substance-form-simplified-references-card.component';

describe('SubstanceFormSimplifiedReferencesCardComponent', () => {
  let component: SubstanceFormSimplifiedReferencesCardComponent;
  let fixture: ComponentFixture<SubstanceFormSimplifiedReferencesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ SubstanceFormSimplifiedReferencesCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SubstanceFormService, useValue: { definition: NEVER } },
        { provide: SubstanceFormReferencesService, useValue: { domainsWithReferences: NEVER, substanceReferences: NEVER } },
        { provide: SubstanceFormNamesService, useValue: { substanceNames: NEVER } },
        { provide: SubstanceFormCodesService, useValue: { substanceCodes: NEVER } },
        { provide: SubstanceFormStructureService, useValue: { substanceStructure: NEVER } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
        { provide: ScrollToService, useValue: { scrollToElement: () => null } },
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormSimplifiedReferencesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
