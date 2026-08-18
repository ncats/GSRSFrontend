import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';
import { UtilsService } from '@gsrs-core/utils';
import { FacetsManagerService } from './facets-manager.service';
import { AuthService } from '@gsrs-core/auth';
import { ConfigService } from '@gsrs-core/config';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics/google-analytics.service';
import { vi } from 'vitest';

import { FacetsManagerComponent } from './facets-manager.component';

describe('FacetsManagerComponent', () => {
  let component: FacetsManagerComponent;
  let fixture: ComponentFixture<FacetsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacetsManagerComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } },
        { provide: UtilsService, useValue: {} },
        // facetsService and facetManagerService are both this same token; ngOnInit subscribes
        // to clearSelectionsEvent directly, so it needs to be an Observable property. Must NOT
        // emit synchronously on subscribe (unlike of(...)) - that would immediately trigger
        // clearFacetSelection(), which schedules a setTimeout calling router.createUrlTree().
        { provide: FacetsManagerService, useValue: { clearSelectionsEvent: new Subject<void>() } },
        { provide: AuthService, useValue: { getAuth: vi.fn().mockReturnValue(of(null)) } },
        { provide: ConfigService, useValue: { environment: {}, configData: {} } },
        { provide: GoogleAnalyticsService, useValue: { sendEvent: vi.fn(), sendPageView: vi.fn() } },
        { provide: Router, useValue: {} },
        { provide: Location, useValue: {} },
        { provide: MatDialog, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacetsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
