import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatMenuModule } from '@angular/material/menu';
import { of } from 'rxjs';
import { UtilsService } from '../../utils/utils.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { AuthService } from '@gsrs-core/auth';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { StructureService } from '@gsrs-core/structure';
import { ComponentFactoryResolver } from '@angular/core';
import { Router } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '@gsrs-core/config';
import { BulkSearchService } from '@gsrs-core/bulk-search/service/bulk-search.service';
import { DYNAMIC_COMPONENT_MANIFESTS } from '@gsrs-core/dynamic-component-loader';
import { CardDynamicSectionDirective } from '../card-dynamic-section/card-dynamic-section.directive';
import { FacetDisplayPipe } from '@gsrs-core/facets-manager/facet-display.pipe';
import { SubstanceSummaryCardComponent } from './substance-summary-card.component';

describe('SubstanceSummaryCardComponent', () => {
  let component: SubstanceSummaryCardComponent;
  let fixture: ComponentFixture<SubstanceSummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, MatMenuModule ],
      declarations: [ SubstanceSummaryCardComponent, CardDynamicSectionDirective, FacetDisplayPipe ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: UtilsService, useValue: { getBuildInfo: () => of({}), handleMatSidenavOpen: () => null, handleMatSidenavClose: () => null } },
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
        { provide: AuthService, useValue: { getAuth: () => of(null), checkAuth: () => of(null), canEditData: () => Promise.resolve(false), hasSpecificPrivilege: () => Promise.resolve(false), getUser: () => null, logout: () => {} } },
        { provide: SubstanceService, useValue: {} },
        { provide: StructureService, useValue: {} },
        { provide: ComponentFactoryResolver, useValue: {} },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), events: of({}), url: '', routerState: { snapshot: { url: '' } }, createUrlTree: () => ({}), serializeUrl: () => '', routeReuseStrategy: { shouldReuseRoute: () => false } } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
        { provide: ConfigService, useValue: { configData: {}, environment: {}, afterLoad: () => Promise.resolve({}) } },
        { provide: BulkSearchService, useValue: {} },
        { provide: DYNAMIC_COMPONENT_MANIFESTS, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceSummaryCardComponent);
    component = fixture.componentInstance;
    component.substance = { uuid: 'test-uuid', substanceClass: 'chemical' } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
