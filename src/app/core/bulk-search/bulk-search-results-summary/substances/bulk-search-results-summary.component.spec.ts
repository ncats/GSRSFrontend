import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NEVER } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '@gsrs-core/auth';
import { LoadingService } from '@gsrs-core/loading';
import { BulkSearchService } from '@gsrs-core/bulk-search/service/bulk-search.service';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { ConfigService } from '@gsrs-core/config';

import { BulkSearchResultsSummaryComponent } from './bulk-search-results-summary.component';

describe('BulkSearchResultsSummaryComponent', () => {
  let component: BulkSearchResultsSummaryComponent;
  let fixture: ComponentFixture<BulkSearchResultsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkSearchResultsSummaryComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: LoadingService, useValue: { setLoading: () => null } },
        { provide: AuthService, useValue: { getAuth: () => NEVER } },
        { provide: MainNotificationService, useValue: { setNotification: () => null } },
        { provide: BulkSearchService, useValue: { getBulkSearchStatus: () => NEVER } },
        { provide: ConfigService, useValue: { configData: {} } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: Location, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkSearchResultsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
