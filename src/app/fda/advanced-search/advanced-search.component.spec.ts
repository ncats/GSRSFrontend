import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, NO_ERRORS_SCHEMA, Output } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { AdvancedSearchService } from './service/advanced-search.service';
import { AdverseEventService } from '../adverse-event/service/adverseevent.service';
import { ConfigService } from '@gsrs-core/config';
import { UtilsService } from '@gsrs-core/utils';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { ApplicationService } from '../application/service/application.service';
import { ProductService } from '../product/service/product.service';
import { ClinicalTrialService } from '../clinical-trials/clinical-trial/clinical-trial.service';
import { FacetsManagerService } from '@gsrs-core/facets-manager';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics/google-analytics.service';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { StructureService } from '@gsrs-core/structure/structure.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { StructureEditorModule } from '@gsrs-core/structure-editor/structure-editor.module';
import { NameResolverModule } from '@gsrs-core/name-resolver/name-resolver.module';
import { AdvancedSearchComponent } from './advanced-search.component';

// real <app-structure-editor>/<app-name-resolver> pull in DOM/HTTP machinery
// (Ketcher/JSDraw canvas wiring, live SubstanceService calls) that doesn't
// survive a headless test environment; stub their DOM surface instead of
// patching the real components, same approach already used for these two in
// structure-search.component.spec.ts.
@Component({
  selector: 'app-structure-editor',
  template: '',
  standalone: true
})
class StructureEditorStubComponent {
  @Output() editorOnLoad = new EventEmitter<any>();
  @Output() loadedMolfile = new EventEmitter<any>();
}

@Component({
  selector: 'app-name-resolver',
  template: '',
  standalone: true
})
class NameResolverStubComponent {
  @Output() structureSelected = new EventEmitter<string>();
}

describe('AdvancedSearchComponent', () => {
  let component: AdvancedSearchComponent;
  let fixture: ComponentFixture<AdvancedSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, AdvancedSearchComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), events: of({}), url: '', routerState: { snapshot: { url: '' } }, createUrlTree: () => ({}), serializeUrl: () => '', routeReuseStrategy: { shouldReuseRoute: () => false } } },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {}, queryParams: {}, queryParamMap: { get: () => null, has: () => false } }, params: of({}), queryParams: of({}), queryParamMap: of({ get: () => null, has: () => false }) } },
        { provide: LoadingService, useValue: { setLoading: () => null, resetLoading: () => null } },
        { provide: AdvancedSearchService, useValue: {
          getSubstances: () => of([]), getApplications: () => of([]), getProducts: () => of([]), getClinicalTrials: () => of([])
        } },
        { provide: AdverseEventService, useValue: {} },
        { provide: ConfigService, useValue: { configData: { facets: { substances: { facetView: [] } } }, environment: {}, afterLoad: () => Promise.resolve({}) } },
        { provide: UtilsService, useValue: { getBuildInfo: () => of({}), handleMatSidenavOpen: () => null, handleMatSidenavClose: () => null } },
        { provide: SubstanceService, useValue: {} },
        { provide: ApplicationService, useValue: {} },
        { provide: ProductService, useValue: {} },
        { provide: ClinicalTrialService, useValue: {} },
        { provide: FacetsManagerService, useValue: { registerGetFacetsHandler: () => {}, unregisterFacetSearchHandler: () => {}, getFacetParams: () => ({}), clearSelections: () => {} } },
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
        { provide: Title, useValue: { setTitle: () => {} } },
        { provide: Location, useValue: {} },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
        { provide: StructureService, useValue: {} },
        { provide: AuthService, useValue: { hasPrivilege: () => false, getAuth: () => of(null) } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
      ]
    })
    .overrideComponent(AdvancedSearchComponent, {
      remove: { imports: [StructureEditorModule, NameResolverModule] },
      add: { imports: [StructureEditorStubComponent, NameResolverStubComponent] }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
