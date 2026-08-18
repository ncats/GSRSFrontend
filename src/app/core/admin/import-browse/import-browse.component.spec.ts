import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, NEVER } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { StructureService } from '@gsrs-core/structure';
import { UtilsService } from '@gsrs-core/utils';
import { FacetsManagerService } from '@gsrs-core/facets-manager';
import { SubstanceTextSearchService } from '@gsrs-core/substance-text-search/substance-text-search.service';
import { DYNAMIC_COMPONENT_MANIFESTS } from '@gsrs-core/dynamic-component-loader';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { WildcardService } from '@gsrs-core/utils/wildcard.service';
import { SubstanceService } from '@gsrs-core/substance';
import { ConfigService } from '@gsrs-core/config';
import { SubBrowseEmitterService } from '@gsrs-core/substances-browse/sub-browse-emitter.service';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { AuthService } from '@gsrs-core/auth';
import { AdminService } from '@gsrs-core/admin/admin.service';

import { ImportBrowseComponent } from './import-browse.component';

describe('ImportBrowseComponent', () => {
  let component: ImportBrowseComponent;
  let fixture: ComponentFixture<ImportBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportBrowseComponent ],
      imports: [ MatSidenavModule, NoopAnimationsModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {}, params: {} } } },
        { provide: SubstanceService, useValue: { getStagingFacets: () => NEVER, getSubstanceNames: () => NEVER, getSubstanceCodes: () => NEVER, getFasta: () => NEVER, getSubstanceDetails: () => NEVER } },
        { provide: ConfigService, useValue: { configData: { facets: { substances: { facetView: [] } } }, environment: {} } },
        { provide: SubBrowseEmitterService, useValue: { setRefresh: () => null, setCancel: () => null } },
        { provide: LoadingService, useValue: { setLoading: () => null } },
        { provide: MainNotificationService, useValue: { setNotification: () => null } },
        { provide: UtilsService, useValue: { hashCode: () => 1, handleMatSidenavOpen: () => null, handleMatSidenavClose: () => null, looksLikeComplexSearchTerm: () => false } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), events: NEVER, url: '', routerState: { snapshot: { url: '' } }, createUrlTree: () => ({}), serializeUrl: () => '', routeReuseStrategy: { shouldReuseRoute: () => false } } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => NEVER }) } },
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
        { provide: AuthService, useValue: { getAuth: () => NEVER, hasSpecificPrivilege: () => Promise.resolve(false), getUser: () => '', startUserDownload: () => NEVER } },
        { provide: StructureService, useValue: { downloadMolfile: () => NEVER } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: Location, useValue: {} },
        { provide: FacetsManagerService, useValue: { registerGetFacetsHandler: () => null, unregisterFacetSearchHandler: () => null, clearSelections: () => null } },
        { provide: SubstanceTextSearchService, useValue: { setSearchValue: () => null } },
        { provide: Title, useValue: { setTitle: () => null } },
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => of({ CODE_SYSTEM: { dictionary: {} } }) } },
        { provide: WildcardService, useValue: { getWildCardText: () => null } },
        { provide: AdminService, useValue: { getImportScrubberSchema: () => NEVER, SearchStagedData: () => NEVER, GetStagedData: () => NEVER, GetStagedRecord: () => NEVER } },
        { provide: DYNAMIC_COMPONENT_MANIFESTS, useValue: [] }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
