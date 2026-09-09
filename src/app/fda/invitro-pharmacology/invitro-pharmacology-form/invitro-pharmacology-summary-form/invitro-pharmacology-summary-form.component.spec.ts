import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NEVER, of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary/controlled-vocabulary.service';
import { GeneralService } from '../../../service/general.service';
import { InvitroPharmacologyService } from '../../service/invitro-pharmacology.service';
import { ConfigService } from '@gsrs-core/config';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { StructureService } from '@gsrs-core/structure';

import { InvitroPharmacologySummaryFormComponent } from './invitro-pharmacology-summary-form.component';

describe('InvitroPharmacologySummaryFormComponent', () => {
  let component: InvitroPharmacologySummaryFormComponent;
  let fixture: ComponentFixture<InvitroPharmacologySummaryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ InvitroPharmacologySummaryFormComponent, HttpClientTestingModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: {}, queryParams: {} }, params: NEVER } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), events: of({}) } },
        { provide: DomSanitizer, useValue: { bypassSecurityTrustHtml: (v: any) => v } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => NEVER }) } },
        { provide: Title, useValue: { setTitle: () => null } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: AuthService, useValue: { getUser: () => '', hasSpecificPrivilege: () => Promise.resolve(false), hasPrivilege: () => false } },
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => NEVER } },
        { provide: UtilsService, useValue: {} },
        { provide: LoadingService, useValue: { setLoading: () => null } },
        { provide: MainNotificationService, useValue: { setNotification: () => null } },
        { provide: GeneralService, useValue: {} },
        { provide: InvitroPharmacologyService, useValue: {} },
        // app-substance-selector (standalone-imported) constructor deps
        { provide: ConfigService, useValue: { configData: {} } },
        { provide: SubstanceService, useValue: {} },
        { provide: SubstanceFormService, useValue: { getStoredRelated: () => null } },
        { provide: ScrollToService, useValue: {} },
        { provide: StructureService, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitroPharmacologySummaryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
