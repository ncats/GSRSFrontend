import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdverseEventsCvmBrowseComponent } from './adverse-events-cvm-browse.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, LocationStrategy } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { FacetsManagerService } from '@gsrs-core/facets-manager';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { GoogleAnalyticsService } from '../../../../app/core/google-analytics/google-analytics.service';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { AdverseEventService } from '../service/adverseevent.service';
import { GeneralService } from '../../service/general.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AdverseEventsCvmBrowseComponent', () => {
  let component: AdverseEventsCvmBrowseComponent;
  let fixture: ComponentFixture<AdverseEventsCvmBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdverseEventsCvmBrowseComponent ],
      // this large browse template pulls in many Material modules unrelated to what
      // this smoke test verifies; see product-component-form.component.spec.ts for the
      // same reasoning.
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: AdverseEventService, useValue: {} },
        { provide: GeneralService, useValue: {} },
        // ngOnInit reads activatedRoute.snapshot.queryParams directly.
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } },
        { provide: Location, useValue: {} },
        { provide: LocationStrategy, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: DomSanitizer, useValue: {} },
        { provide: GoogleAnalyticsService, useValue: {} },
        { provide: ConfigService, useValue: {} },
        { provide: LoadingService, useValue: {} },
        { provide: MainNotificationService, useValue: {} },
        // ngOnInit awaits this and subscribes to getAuth().
        { provide: AuthService, useValue: { hasSpecificPrivilege: () => Promise.resolve(false), hasPrivilege: () => false, getAuth: () => of(null) } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        // ngOnInit/ngOnDestroy call these directly.
        { provide: FacetsManagerService, useValue: { registerGetFacetsHandler: () => null, unregisterFacetSearchHandler: () => null } },
        { provide: UtilsService, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: Title, useValue: { setTitle: () => null } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdverseEventsCvmBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
