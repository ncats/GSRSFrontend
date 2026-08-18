import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NEVER } from 'rxjs';
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

import { InvitroPharmacologyAssaysetFormComponent } from './invitro-pharmacology-assayset-form.component';

describe('InvitroPharmacologyAssaysetFormComponent', () => {
  let component: InvitroPharmacologyAssaysetFormComponent;
  let fixture: ComponentFixture<InvitroPharmacologyAssaysetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitroPharmacologyAssaysetFormComponent ],
      imports: [ HttpClientTestingModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: {}, queryParams: {} } } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: DomSanitizer, useValue: { bypassSecurityTrustHtml: (v: any) => v } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => NEVER }) } },
        { provide: Title, useValue: { setTitle: () => null } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: AuthService, useValue: { getUser: () => '', hasSpecificPrivilege: () => Promise.resolve(false) } },
        { provide: ControlledVocabularyService, useValue: {} },
        { provide: UtilsService, useValue: {} },
        { provide: LoadingService, useValue: { setLoading: () => null } },
        { provide: MainNotificationService, useValue: { setNotification: () => null } },
        { provide: GeneralService, useValue: {} },
        { provide: InvitroPharmacologyService, useValue: { getAllAssaySets: () => NEVER } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitroPharmacologyAssaysetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
