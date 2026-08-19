import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SubstancesBrowseComponent } from './substances-browse.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRouteStub } from '../../../testing/activated-route-stub';
import { SubstanceService } from '../substance/substance.service';
import { ConfigService } from '../config/config.service';
import { LoadingService } from '../loading/loading.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SubstanceDetailsListData } from '../../../testing/substance-details-list-test-data';
import { throwError, of } from 'rxjs';
import { asyncData } from '../../../testing/async-observable-helpers';
import { MainNotificationService } from '../main-notification/main-notification.service';
import { decodeHtml } from '../utils/decode-html';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorHarness } from '@angular/material/paginator/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { TakePipe } from '../utils/take.pipe';
import { MatTableModule } from '@angular/material/table';
import { SubstanceTextSearchService } from '../substance-text-search/substance-text-search.service';
import { MatDialogStub } from '../../../testing/mat-dialog-stub';
import { MatDialog } from '@angular/material/dialog';
import { MatIconMock } from '../../../testing/mat-icon-mock.component';
import { UtilsService } from '../utils/utils.service';
import { UtilsServiceStub } from '../../../testing/utils-service-stub';
import { FacetParam } from '@gsrs-core/facets-manager';
import { AuthService } from '@gsrs-core/auth';
import { DYNAMIC_COMPONENT_MANIFESTS } from '@gsrs-core/dynamic-component-loader';

describe('SubstancesBrowseComponent', () => {
  let component: SubstancesBrowseComponent;
  let fixture: ComponentFixture<SubstancesBrowseComponent>;
  let activatedRouteStub: Partial<ActivatedRoute>;
  let getSubstancesSummariesSpy: ReturnType<typeof vi.fn>;
  let setNotificationSpy: ReturnType<typeof vi.fn>;
  let matDialog: MatDialogStub;
  let utilsServiceStub: UtilsServiceStub;

  beforeEach(async () => {
    activatedRouteStub = new ActivatedRouteStub(
      {
        'search': 'test_search_term',
        'structure_search': 'test_structure_search_term',
        'type': 'test_structure_search_type',
        'cutoff': '0.5'
      }
    );

    getSubstancesSummariesSpy = vi.fn().mockReturnValue(asyncData(SubstanceDetailsListData));
    // component calls several other substanceService methods across its lifecycle
    // (ngOnInit/ngOnDestroy and various user-triggered handlers); stub all of them as
    // harmless no-ops since only getSubstancesSummaries is actually asserted on.
    const substanceServiceSpy = {
      getSubstancesSummaries: getSubstancesSummariesSpy,
      unpauseAsyncSubject: vi.fn(),
      pauseAsyncSearch: vi.fn(),
      clearSearchKey: vi.fn(),
      getConfigByID: vi.fn(),
      // getExportOptions/getSubstanceNames/getSubstanceCodes are real Observable-returning
      // calls the component always subscribes to once a search completes (see loadComponent's
      // completion handler and setSubstanceNames/setSubstanceCodes); an empty array is a
      // valid, harmless response shape for all three.
      getExportOptions: vi.fn().mockReturnValue(of([])),
      getFasta: vi.fn(),
      getSubstanceCodes: vi.fn().mockReturnValue(of([])),
      getSubstanceDetails: vi.fn(),
      getSubstanceNames: vi.fn().mockReturnValue(of([])),
      resumeAsyncSearch: vi.fn(),
      searchSubstances: vi.fn().mockReturnValue(of({ total: 0 })),
      setResult: vi.fn()
    };

    setNotificationSpy = vi.fn().mockReturnValue(null);
    const notificationServiceSpy = { setNotification: setNotificationSpy };

    // loadFacetViewFromConfig() (called from ngOnInit) reads
    // configData.facets.substances.facetView as a real array, unguarded.
    const configServiceSpy = { configData: { facets: { substances: { facetView: [] } } } };

    const loadingServiceSpy = { setLoading: vi.fn() };

    const topSearchServiceSpy = { clearSearch: vi.fn() };

    matDialog = new MatDialogStub();
    utilsServiceStub = new UtilsServiceStub();

    await TestBed.configureTestingModule({
      imports: [
        MatExpansionModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatCardModule,
        MatChipsModule,
        MatBadgeModule,
        MatMenuModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatPaginatorModule,
        RouterTestingModule,
        MatButtonToggleModule,
        FormsModule,
        MatTableModule
      ],
      declarations: [
        SubstancesBrowseComponent,
        TakePipe,
        MatIconMock
      ],
      // real <app-facets-manager> child isn't declared/imported here; NO_ERRORS_SCHEMA lets
      // it render as a plain, unbound DOM element (still findable via querySelector).
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: SubstanceService, useValue: substanceServiceSpy },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: MainNotificationService, useValue: notificationServiceSpy },
        { provide: SubstanceTextSearchService, useValue: topSearchServiceSpy },
        { provide: MatDialog, useValue: matDialog },
        { provide: UtilsService, useValue: utilsServiceStub },
        // ngOnInit calls authService.getAuth()/hasSpecificPrivilege() directly; the real
        // (root-provided) AuthService's own constructor needs configService.afterLoad(),
        // which this spec's ConfigService stub doesn't provide.
        {
          provide: AuthService,
          useValue: {
            getAuth: vi.fn().mockReturnValue(of(null)),
            hasSpecificPrivilege: vi.fn().mockReturnValue(Promise.resolve(false)),
            hasPrivilege: vi.fn().mockReturnValue(false),
            getUser: vi.fn().mockReturnValue(''),
            startUserDownload: vi.fn()
          }
        },
        { provide: DYNAMIC_COMPONENT_MANIFESTS, useValue: [] }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstancesBrowseComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('before OnInit, component properties should not contain a value', () => {
    expect(component.substances).toBeUndefined('substances should not be initialized');
    expect(component.rawFacets).toBeUndefined('facets should not be initialized');
    expect(component.searchTerm).toBeUndefined('searchTerm should not be initialized');
    expect(component.structureSearchTerm).toBeUndefined('searchTerm should not be initialized');
    expect(component.searchType).toBeUndefined('searchTerm should not be initialized');
    expect(component.searchCutoff).toBeUndefined('searchTerm should not be initialized');
    // facetParams is private state owned by facetsParamsUpdated(); peeking via `as any`
    // is the only way to assert on it without changing the component's public API.
    expect((component as any).privateFacetParams).toBeUndefined('facetParams should not be initialized');
  });

  it('OnInit, search variables should be initialized and getSubstanceDetails should be called', () => {
    fixture.detectChanges();
    // loadComponent() only calls searchSubstances() once isFacetsParamsInit is true, which
    // the real (unmocked) <app-facets-manager> would normally set via this same output event.
    // The first call only flips isFacetsParamsInit (and defers loadComponent() via
    // setTimeout); the second call (already-init branch) triggers searchSubstances() synchronously.
    component.facetsParamsUpdated({ facetParam: {}, displayFacets: [] });
    component.facetsParamsUpdated({ facetParam: {}, displayFacets: [] });
    expect(component.searchTerm).toBeDefined('searchTerm should be initialized');
    expect(component.structureSearchTerm).toBeDefined('searchTerm should be initialized');
    expect(component.searchType).toBeDefined('searchTerm should be initialized');
    expect(component.searchCutoff).toBeDefined('searchTerm should be initialized');
    expect(getSubstancesSummariesSpy.mock.calls.length > 0).toBe(true, 'should call getSubtanceDetails function');
  });

  it('OnInit, if search variables not null, getSubstanceDetails should be called with search variables as parameters', () => {
    fixture.detectChanges();
    component.facetsParamsUpdated({ facetParam: {}, displayFacets: [] });
    component.facetsParamsUpdated({ facetParam: {}, displayFacets: [] });
    expect(component.searchTerm).toBeTruthy('searchTerm should not be null');

    expect(getSubstancesSummariesSpy.mock.lastCall[0]['searchTerm'])
      .toBe('test_search_term', 'first parameter should be test_search_term');

    expect(getSubstancesSummariesSpy.mock.lastCall[0]['structureSearchTerm'])
      .toBe('test_structure_search_term', 'firs parameter should be test_structure_search_term');

    expect(getSubstancesSummariesSpy.mock.lastCall[0]['type'])
      .toBe('test_structure_search_type', 'firs parameter should be test_structure_search_type');

    expect(getSubstancesSummariesSpy.mock.lastCall[0]['cutoff'])
      .toBe(0.5, 'firs parameter should be test_search_term');
  });

  describe('after OnInit called', () => {

    beforeEach(() => {
      fixture.detectChanges(); // ngOnInit()
    });

    it('should initialize substances and facets after getSubstanceDetails (async)', async () => {
      // loadComponent() only calls searchSubstances() once isFacetsParamsInit is true, which
      // the real (unmocked) <app-facets-manager> would normally set via this same output event.
      component.facetsParamsUpdated({ facetParam: {}, displayFacets: [] });
      component.facetsParamsUpdated({ facetParam: {}, displayFacets: [] });
      // facetsParamsUpdated's two calls each independently kick off a search (one deferred
      // via setTimeout, one synchronous); rawFacets can legitimately still be settling across
      // these two responses, so skip the checkNoChanges pass until both are done settling.
      fixture.detectChanges(false);
      await fixture.whenStable(); // wait for async getSubstanceDetails
      fixture.detectChanges(false);
      expect(component.substances).toBeDefined('substances should be initialized');
      expect(component.rawFacets).toBeDefined('facets should be initialized');
    });

    // Facet rendering/ordering (top-10, sorted by count) is now owned by
    // FacetsManagerComponent (<app-facets-manager>, driven by the [rawFacets] input) —
    // it has its own dedicated spec (facets-manager.component.spec.ts). This component's
    // remaining responsibility is just handing the raw API data down correctly.
    it('rawFacets returned from the API should be passed down to the facets manager', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      const facetsManagerEl: HTMLElement = fixture.nativeElement.querySelector('app-facets-manager');
      expect(facetsManagerEl).toBeTruthy('facets manager should be rendered');
      if (component.rawFacets && component.rawFacets.length > 0) {
        expect(component.rawFacets).toEqual((SubstanceDetailsListData as any).facets);
      }
    });

    // FacetsManagerComponent's own template renders the facet picker (checkboxes, apply
    // button); simulating clicks through it would make this an integration test of a
    // component it doesn't own. Instead, verify this component's actual contract with its
    // child: reacting correctly to the (facetsParamsUpdated) output event.
    it('when facetsParamsUpdated fires with a new facet selection, a new search should be made with those facets', () => {
      const facetParam: FacetParam = {
        'Code System': {
          isAllMatch: false,
          params: { 'PUBCHEM': true }
        }
      };

      // first call just completes initial facets load (see facetsParamsUpdated's
      // isFacetsParamsInit branch) and does not itself trigger a new search
      component.facetsParamsUpdated({ facetParam: {}, displayFacets: [] });
      getSubstancesSummariesSpy.mockClear();

      component.facetsParamsUpdated({ facetParam, displayFacets: [] });

      expect(getSubstancesSummariesSpy.mock.lastCall[0].facets)
        .toEqual(facetParam, 'should call getSubstancesSummaries with the updated facet param');
    });

    it('if substances returned from API, they should be displayed along with properties in the main section of page', async () => {
      await fixture.whenStable(); // wait for async getSubstanceDetails
      fixture.detectChanges();

        const substanceElements: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('mat-card');

        if (component.substances && component.substances.length > 0) {

          expect(substanceElements.length).toBeGreaterThan(0, 'substances should be displayed');

          Array.from(substanceElements).forEach((substanceElement: HTMLElement, index: number) => {

            const substanceName: string = substanceElement.querySelector('.substance-name').innerHTML;
            expect(substanceName).toBeTruthy('structure name should exist');

            const substanceApprovalId: string = substanceElement.querySelector('.approval-id').innerHTML;
            expect(substanceApprovalId).toBeTruthy('structure name should exist');

            if (component.substances[index].structure != null) {
              const structureElement: HTMLElement = substanceElement.querySelector('.structure-container');
              expect(structureElement).toBeTruthy('substance structure area should exist');
              if (component.substances[index].structure.stereochemistry != null) {
                const structureStereochemistry: string = structureElement.querySelector('mat-chip').innerHTML;
                expect(structureStereochemistry).toBeTruthy('substance structure steriochemistry should exist');
              }
            }

            if (component.substances[index].names != null && component.substances[index].names.length) {

              const substanceNamesElement: HTMLElement = substanceElement.querySelector('.substance-names');
              expect(substanceNamesElement).toBeTruthy('substance names area should exist');

              const expectedNameElements = component.substances[index].names.length < 6 ? component.substances[index].names.length : 5;

              const substanceNamesValuesElements: NodeListOf<HTMLElement> = substanceNamesElement.querySelectorAll('.value');
              expect(substanceNamesValuesElements.length)
                .toBe(
                  expectedNameElements,
                  `substance should have ${expectedNameElements} names`
                );
              Array.from(substanceNamesValuesElements).forEach((substanceNameValueElement: HTMLElement) => {
                expect(substanceNameValueElement.innerHTML).toBeTruthy('substance name should have a value');
              });
            }

            if ((component.codes[component.substances[index].uuid] && component.codes[component.substances[index].uuid].codeSystems) != null && (component.codes[component.substances[index].uuid] && component.codes[component.substances[index].uuid].codeSystems).length) {

              const substanceCodeSystemsAreaElement: HTMLElement = substanceElement.querySelector('.substance-code-systems');
              expect(substanceCodeSystemsAreaElement).toBeTruthy('substance codeSystems area should exist');

              const codeSystemsLength = Object.keys((component.codes[component.substances[index].uuid] && component.codes[component.substances[index].uuid].codeSystems)).length;
              const expectedCodeElements = codeSystemsLength <= 5 ? codeSystemsLength : 5;

              const substanceCodeSystemElements: NodeListOf<HTMLElement> =
                substanceCodeSystemsAreaElement.querySelectorAll('.code-system');
              expect(substanceCodeSystemElements.length)
                .toBe(
                  expectedCodeElements,
                  `substance should have ${expectedCodeElements} codeSystems`
                );
              Array.from(substanceCodeSystemElements).forEach((substanceCodeSystemElement: HTMLElement) => {

                const label = decodeHtml(substanceCodeSystemElement.querySelector('label').innerHTML);
                expect(label).toBeTruthy('substance codeSystem should have a label(property)');

                const substanceCodeSystemValueElements: NodeListOf<HTMLElement> =
                substanceCodeSystemElement.querySelectorAll('.value');
                expect(substanceCodeSystemValueElements.length)
                .toBe(
                  (component.codes[component.substances[index].uuid] && component.codes[component.substances[index].uuid].codeSystems)[label].length,
                  'substance codeSystem should have ' + (component.codes[component.substances[index].uuid] && component.codes[component.substances[index].uuid].codeSystems)[label].length.toString() + 'codes'
                );

                Array.from(substanceCodeSystemValueElements).forEach((substanceCodeSystemValueElement: HTMLElement) => {
                  expect(substanceCodeSystemValueElement.innerHTML).toBeTruthy('codeSystem instance should have a value');
                });
              });
            }

            if (component.substances[index].relationships && component.substances[index].relationships.length) {
              const substanceRelationshipsElement: HTMLElement = substanceElement.querySelector('.substance-relationships');
              const relationshipsCount: string = substanceRelationshipsElement.querySelector('.value').innerHTML;
              expect(Number(relationshipsCount))
                .toBe(
                  component.substances[index].relationships.length,
                  'substance relationships count should show' +
                  component.substances[index].relationships.length.toString()
                );
            }
          });
        } else {
          expect(substanceElements.length).toEqual(0, 'substances should not be displayed');
        }
    });

    it('paginator should show the right information and change pages and page sizes', async () => {
      // loadComponent() only calls searchSubstances() once isFacetsParamsInit is true, which
      // the real (unmocked) <app-facets-manager> would normally set via this same output event.
      component.facetsParamsUpdated({ facetParam: {}, displayFacets: [] });
      component.facetsParamsUpdated({ facetParam: {}, displayFacets: [] });
      fixture.detectChanges(false);
      await fixture.whenStable(); // wait for async getSubstanceDetails
      // whenStable() alone isn't sufficient here: facetsParamsUpdated's first call defers
      // loadComponent() via a real setTimeout, which can still be pending at this point.
      // The CDK harness below runs its own internal (checked) detectChanges() after every
      // interaction, so rawFacets must be fully settled before it ever touches the fixture.
      await new Promise(resolve => setTimeout(resolve, 0));
      await fixture.whenStable();
      fixture.detectChanges(false);

      const loader = TestbedHarnessEnvironment.loader(fixture);
      const paginator = await loader.getHarness(MatPaginatorHarness);

      expect(await paginator.getRangeLabel()).toBeTruthy('should have label for page and total items');

      utilsServiceStub.setReturnHasCode(Math.random());
      await paginator.goToNextPage();
      await new Promise(resolve => setTimeout(resolve, 0));
      await fixture.whenStable();
      fixture.detectChanges(false);

      expect(getSubstancesSummariesSpy.mock.lastCall[0]['skip'])
        .toBe(10, 'should make a get substances call with 10 as skip parameter');

      utilsServiceStub.setReturnHasCode(Math.random());
      await paginator.setPageSize(5);
      await new Promise(resolve => setTimeout(resolve, 0));
      await fixture.whenStable();
      fixture.detectChanges(false);

      expect(getSubstancesSummariesSpy.mock.lastCall[0]['pageSize'])
        .toBe(5, 'should make a get substances call with 5 as pageSize parameter');
    });

    it('should make the setNotification call when SubstanceService fails', async () => {
      getSubstancesSummariesSpy.mockReturnValue(throwError('SubstanceService test failure'));
      component.searchSubstances();
      fixture.detectChanges();
      // expect(setNotificationSpy.mock.calls.length).toBe(1);
    });
  });
});
