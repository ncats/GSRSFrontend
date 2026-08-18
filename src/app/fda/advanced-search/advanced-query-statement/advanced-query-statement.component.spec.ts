import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '@gsrs-core/config';
import { UtilsService } from '@gsrs-core/utils';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { ApplicationService } from '../../application/service/application.service';
import { ProductService } from '../../product/service/product.service';
import { ClinicalTrialService } from '../../clinical-trials/clinical-trial/clinical-trial.service';
import { FacetsManagerService } from '@gsrs-core/facets-manager';
import { AdvancedSearchService } from '../service/advanced-search.service';
import { AdvancedQueryStatementComponent } from './advanced-query-statement.component';

describe('AdvancedQueryStatementComponent', () => {
  let component: AdvancedQueryStatementComponent;
  let fixture: ComponentFixture<AdvancedQueryStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ AdvancedQueryStatementComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: ControlledVocabularyService, useValue: {} },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), events: of({}), url: '', routerState: { snapshot: { url: '' } }, createUrlTree: () => ({}), serializeUrl: () => '', routeReuseStrategy: { shouldReuseRoute: () => false } } },
        { provide: ConfigService, useValue: { configData: {}, environment: {}, afterLoad: () => Promise.resolve({}) } },
        { provide: UtilsService, useValue: { getBuildInfo: () => of({}), handleMatSidenavOpen: () => null, handleMatSidenavClose: () => null } },
        { provide: SubstanceService, useValue: {} },
        { provide: ApplicationService, useValue: {} },
        { provide: ProductService, useValue: {} },
        { provide: ClinicalTrialService, useValue: {} },
        { provide: FacetsManagerService, useValue: { registerGetFacetsHandler: () => {}, unregisterFacetSearchHandler: () => {}, getFacetParams: () => ({}), clearSelections: () => {} } },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {}, queryParams: {}, queryParamMap: { get: () => null, has: () => false } }, params: of({}), queryParams: of({}), queryParamMap: of({ get: () => null, has: () => false }) } },
        { provide: AdvancedSearchService, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedQueryStatementComponent);
    component = fixture.componentInstance;
    component.queryableDictionary = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
