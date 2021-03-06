import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
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
import { ActivatedRouteStub } from '../../testing/activated-route-stub';
import { SubstanceService } from '../substance/substance.service';
import { ConfigService } from '../config/config.service';
import { LoadingService } from '../loading/loading.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SubstanceDetailsListData } from '../../testing/substance-details-list-test-data';
import { throwError } from 'rxjs';
import { asyncData } from '../../testing/async-observable-helpers';
import { MainNotificationService } from '../main-notification/main-notification.service';
import { decodeHtml } from '../utils/decode-html';
import { MatPaginatorModule } from '@angular/material/paginator';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { TakePipe } from '../utils/take.pipe';
import { MatTableModule } from '@angular/material/table';
import { SubstanceTextSearchService } from '../substance-text-search/substance-text-search.service';
import { MatDialogStub } from '../../testing/mat-dialog-stub';
import { MatDialog } from '@angular/material/dialog';
import { MatIconMock } from '../../testing/mat-icon-mock.component';
import { UtilsService } from '../utils/utils.service';
import { UtilsServiceStub } from '../../testing/utils-service-stub';

describe('SubstancesBrowseComponent', () => {
  let component: SubstancesBrowseComponent;
  let fixture: ComponentFixture<SubstancesBrowseComponent>;
  let activatedRouteStub: Partial<ActivatedRoute>;
  let getSubtanceDetailsSpy: jasmine.Spy;
  let setNotificationSpy: jasmine.Spy;
  let matDialog: MatDialogStub;
  let utilsServiceStub: UtilsServiceStub;

  beforeEach(async(() => {
    activatedRouteStub = new ActivatedRouteStub(
      {
        'search': 'test_search_term',
        'structure_search': 'test_structure_search_term',
        'type': 'test_structure_search_type',
        'cutoff': '0.5'
      }
    );

    const substanceServiceSpy = jasmine.createSpyObj('SubstanceService', ['getSubtanceDetails']);
    getSubtanceDetailsSpy = substanceServiceSpy.getSubtanceDetails.and.returnValue(asyncData(SubstanceDetailsListData));

    const notificationServiceSpy = jasmine.createSpyObj('MainNotificationService', ['setNotification']);
    setNotificationSpy = notificationServiceSpy.setNotification.and.returnValue(null);

    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData']);

    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['setLoading']);

    const topSearchServiceSpy = jasmine.createSpyObj('TopSearchService', ['clearSearch']);

    matDialog = new MatDialogStub();
    utilsServiceStub = new UtilsServiceStub();

    TestBed.configureTestingModule({
      imports: [
        MatExpansionModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatCardModule,
        MatChipsModule,
        MatBadgeModule,
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
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: SubstanceService, useValue: substanceServiceSpy },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: MainNotificationService, useValue: notificationServiceSpy },
        { provide: SubstanceTextSearchService, useValue: topSearchServiceSpy },
        { provide: MatDialog, useValue: matDialog },
        { provide: UtilsService, useValue: utilsServiceStub }
      ]
    })
      .compileComponents();
  }));

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
    expect(component.facets).toBeUndefined('facets should not be initialized');
    expect(component.searchTerm).toBeUndefined('searchTerm should not be initialized');
    expect(component.structureSearchTerm).toBeUndefined('searchTerm should not be initialized');
    expect(component.searchType).toBeUndefined('searchTerm should not be initialized');
    expect(component.searchCutoff).toBeUndefined('searchTerm should not be initialized');
    expect(component.facetParams).toEqual({}, 'facetParams should be an empty object');
  });

  it('OnInit, search variables should be initialized and getSubstanceDetails should be called', () => {
    fixture.detectChanges();
    expect(component.searchTerm).toBeDefined('searchTerm should be initialized');
    expect(component.structureSearchTerm).toBeDefined('searchTerm should be initialized');
    expect(component.searchType).toBeDefined('searchTerm should be initialized');
    expect(component.searchCutoff).toBeDefined('searchTerm should be initialized');
    expect(getSubtanceDetailsSpy.calls.any()).toBe(true, 'should call getSubtanceDetails function');
  });

  it('OnInit, if search variables not null, getSubstanceDetails should be called with search variables as parameters', () => {
    fixture.detectChanges();
    expect(component.searchTerm).toBeTruthy('searchTerm should not be null');

    expect(getSubtanceDetailsSpy.calls.mostRecent().args[0]['searchTerm'])
      .toBe('test_search_term', 'first parameter should be test_search_term');

    expect(getSubtanceDetailsSpy.calls.mostRecent().args[0]['structureSearchTerm'])
      .toBe('test_structure_search_term', 'firs parameter should be test_structure_search_term');

    expect(getSubtanceDetailsSpy.calls.mostRecent().args[0]['type'])
      .toBe('test_structure_search_type', 'firs parameter should be test_structure_search_type');

    expect(getSubtanceDetailsSpy.calls.mostRecent().args[0]['cutoff'])
      .toBe(0.5, 'firs parameter should be test_search_term');
  });

  describe('after OnInit called', () => {

    beforeEach(() => {
      fixture.detectChanges(); // ngOnInit()
    });

    it('should initialize substances and facets after getSubstanceDetails (async)', async(() => {
      fixture.whenStable().then(() => { // wait for async getSubstanceDetails
        fixture.detectChanges();
        expect(component.substances).toBeDefined('substances should be initialized');
        expect(component.facets).toBeDefined('facets should be initialized');
      });
    }));

    it('if facets returned from API, only the top 10 should be displayed ordered by total count in a descending order', async(() => {
      fixture.whenStable().then(() => { // wait for async getSubstanceDetails
        fixture.detectChanges();
        const facetElements: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('mat-expansion-panel');
        if (component.facets && component.facets.length > 0) {
          expect(facetElements.length).toBeGreaterThan(0, 'facets should be displayed');
          expect(facetElements.length).toBeLessThanOrEqual(15, 'up to 10 facets should be displayed');
          let isInOrder = true;
          const valueTotals = [];
          Array.from(facetElements).forEach((facetElement: HTMLElement, index: number) => {
            valueTotals[index] = 0;
            const valuesElements = facetElement.querySelectorAll('.facet-value-count');
            Array.from(valuesElements).forEach((valueElement: HTMLElement) => {
              valueTotals[index] += Number(valueElement.innerHTML);
            });
            if (index > 0 && valueTotals[index] > valueTotals[index - 1]) {
              isInOrder = false;
            }
          });
          expect(isInOrder).toBe(true, 'facets should be in order');
        } else {
          expect(facetElements.length).toEqual(0, 'facets should not be displayed');
        }
      });
    }));

    it('when facet value selected, a new API call for substances should be made passing value as query parameter', async(() => {
      fixture.whenStable().then(() => { // wait for async getSubstanceDetails
        fixture.detectChanges();
        const facetElements: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('mat-expansion-panel');
        if (facetElements && facetElements.length > 0) {

          const maxFacetIndex = facetElements.length - 1;
          const minFacetIndex = 0;
          const randomFacetIndex = Math.floor(Math.random() * (maxFacetIndex - minFacetIndex + 1)) + 0;

          const facetValueElements = facetElements.item(randomFacetIndex).querySelectorAll('.facet-value');
          const maxFacetValueIndex = facetValueElements.length - 1;
          const minFacetValueIndex = 0;
          const randomFacetValueIndex = Math.floor(Math.random() * (maxFacetValueIndex - minFacetValueIndex + 1)) + 0;

          const valueCheckbox: HTMLElement = facetValueElements.item(randomFacetValueIndex).querySelector('.mat-checkbox-inner-container');
          valueCheckbox.click();

          fixture.detectChanges();
          const applyButtonElement: HTMLButtonElement = facetElements.item(randomFacetIndex).querySelector('.apply-button');
          applyButtonElement.click();

          fixture.detectChanges();
          const facetName = decodeHtml(
            facetElements.item(randomFacetIndex).querySelector('mat-panel-title').innerHTML.trim()
          );
          const facetValueLabel = decodeHtml(
            facetValueElements.item(randomFacetValueIndex).querySelector('.facet-value-label').innerHTML.trim()
          );
          expect(component.facetParams[facetName].params[facetValueLabel])
            .toBe(true, 'should add facet value as a parameter to getSubtanceDetails call');
          expect(getSubtanceDetailsSpy.calls.mostRecent().args[0].facets[facetName].params[facetValueLabel])
            .toBe(true, 'should call getSubtanceDetails with selected facet param set to true');
        }
      });
    }));

    it('if substances returned from API, they should be displayed along with properties in the main section of page', async(() => {
      fixture.whenStable().then(() => { // wait for async getSubstanceDetails
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

            if (component.substances[index].codeSystems != null && component.substances[index].codeSystems.length) {

              const substanceCodeSystemsAreaElement: HTMLElement = substanceElement.querySelector('.substance-code-systems');
              expect(substanceCodeSystemsAreaElement).toBeTruthy('substance codeSystems area should exist');

              const codeSystemsLength = Object.keys(component.substances[index].codeSystems).length;
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
                  component.substances[index].codeSystems[label].length,
                  'substance codeSystem should have ' + component.substances[index].codeSystems[label].length.toString() + 'codes'
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
    }));

    it('paginator should show the right information and change pages and page sizes', async(() => {
      fixture.whenStable().then(() => { // wait for async getSubstanceDetails

        fixture.detectChanges();

        const paginatorElement: HTMLElement = fixture.nativeElement.querySelector('mat-paginator');

        const paginatorRangeLabel: HTMLElement = paginatorElement.querySelector('.mat-paginator-range-label');

        expect(paginatorRangeLabel.innerHTML).toBeTruthy('should have label for page and total items');

        const paginatorNext: HTMLButtonElement = paginatorElement.querySelector('.mat-paginator-navigation-next');
        utilsServiceStub.setReturnHasCode(Math.random());
        paginatorNext.click();

        fixture.detectChanges();

        expect(getSubtanceDetailsSpy.calls.mostRecent().args[0]['skip'])
          .toBe(10, 'should make a get substances call with 10 as skip parameter');

        const pageSizeSelectTriggerElement: HTMLButtonElement = paginatorElement.querySelector('.mat-select-trigger');

        pageSizeSelectTriggerElement.click();

        fixture.detectChanges();

        inject([OverlayContainer], (oc: OverlayContainer) => {

          const overlayContainerElement = oc.getContainerElement();

          const pageSizeSelectOptionElement: HTMLButtonElement = overlayContainerElement.querySelector('mat-option');
          utilsServiceStub.setReturnHasCode(Math.random());
          pageSizeSelectOptionElement.click();

          fixture.detectChanges();

          expect(getSubtanceDetailsSpy.calls.mostRecent().args[0]['pageSize'])
            .toBe(5, 'should make a get substances call with 5 as pageSize parameter');

        })();
      });
    }));

    it('should make the setNotification call when SubstanceService fails', async(() => {
      getSubtanceDetailsSpy.and
        .returnValue(throwError('SubstanceService test failure'));
      component.searchSubstances();
      fixture.detectChanges();
      // expect(setNotificationSpy.calls.count()).toBe(1);
    }));
  });
});
