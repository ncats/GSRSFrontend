import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitroPharmacologyAssayDataImportComponent } from './invitro-pharmacology-assay-data-import.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { GeneralService } from '../../service/general.service';
import { InvitroPharmacologyService } from '../service/invitro-pharmacology.service';

describe('InvitroPharmacologyAssayDataImportComponent', () => {
  let component: InvitroPharmacologyAssayDataImportComponent;
  let fixture: ComponentFixture<InvitroPharmacologyAssayDataImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitroPharmacologyAssayDataImportComponent ],
      providers: [
        { provide: HttpClient, useValue: {} },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
        { provide: Router, useValue: {} },
        { provide: DomSanitizer, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: Title, useValue: { setTitle: () => null } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: AuthService, useValue: { hasSpecificPrivilege: () => Promise.resolve(false), hasPrivilege: () => false } },
        { provide: UtilsService, useValue: {} },
        { provide: LoadingService, useValue: {} },
        { provide: MainNotificationService, useValue: {} },
        { provide: GeneralService, useValue: { getSubstanceKeyTypeForInvitroPharmacologyConfig: () => null } },
        { provide: InvitroPharmacologyService, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitroPharmacologyAssayDataImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
