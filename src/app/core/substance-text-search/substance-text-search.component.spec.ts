import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, NgZone } from '@angular/core';
import { vi } from 'vitest';
import { SubstanceTextSearchComponent } from './substance-text-search.component';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UtilsService } from '../utils/utils.service';
import { RouterStub } from '../../../testing/router-stub';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { asyncData } from '../../../testing/async-observable-helpers';
import { SubstanceData } from '../../../testing/substance-suggestion-test-data';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ActivatedRouteStub } from '../../../testing/activated-route-stub';
import { SubstanceTextSearchService } from './substance-text-search.service';
import { Subject } from 'rxjs';
import { MatIconMock } from '../../../testing/mat-icon-mock.component';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { ConfigService } from '@gsrs-core/config';
import { NEVER } from 'rxjs';

describe('TopSearchComponent', () => {
  let component: SubstanceTextSearchComponent;
  let fixture: ComponentFixture<SubstanceTextSearchComponent>;
  let getStructureSearchSuggestionsSpy: ReturnType<typeof vi.fn>;
  let overlayContainerElement;
  let zone: NgZone;
  let routerStub: RouterStub;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(async () => {
    getStructureSearchSuggestionsSpy = vi.fn().mockReturnValue(asyncData(SubstanceData));
    const utilsServiceSpy = { getStructureSearchSuggestions: getStructureSearchSuggestionsSpy };
    routerStub = new RouterStub();
    activatedRouteStub = new ActivatedRouteStub(
      {
        'search_term': 'test_search_term'
      }
    );
    const topSearchServiceSpy: any = { clearSearchEvent: new Subject() };

    await TestBed.configureTestingModule({
      imports: [
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      declarations: [
        SubstanceTextSearchComponent,
        MatIconMock
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: UtilsService, useValue: utilsServiceSpy },
        { provide: Router, useValue: routerStub },
        { provide: NgZone, useFactory: () => zone = new NgZone({ enableLongStackTrace: false }) },
        { provide: SubstanceTextSearchService, useValue: topSearchServiceSpy },
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => NEVER } },
        { provide: ConfigService, useValue: { configData: {}, environment: {} } }
      ]
    })
      .compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainerElement = oc.getContainerElement();
    })();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceTextSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('substance search', () => {
    let suggestionElements: NodeListOf<HTMLElement>;

    beforeEach(() => {
      // lots of examples for testing autocomplete:
      // https://github.com/angular/material2/blob/master/src/lib/autocomplete/autocomplete.spec.ts

      const searchInputElement: HTMLInputElement = fixture.nativeElement.querySelector('.search');
      searchInputElement.focus();
      searchInputElement.dispatchEvent(new Event('focusin'));
      searchInputElement.value = 'test';
      searchInputElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        setTimeout(() => {
          fixture.detectChanges();
          suggestionElements = overlayContainerElement.querySelectorAll('mat-option');
        }, 501);
      });

    });

    it('should get search suggestions on search value changes and show them', async () => {
      await fixture.whenStable();
      await new Promise(resolve => setTimeout(resolve, 502));
      expect(getStructureSearchSuggestionsSpy.mock.calls.length).toBeGreaterThan(0);
      expect(suggestionElements.length).toBeGreaterThan(0);
    });

    it('when search suggestion is clicked/selected, should call function and route to browse page with value as parameter', async () => {
      await fixture.whenStable();
      await new Promise(resolve => setTimeout(resolve, 502));
      const substanceSearchOptionSelectedSpy = vi.spyOn(component, 'substanceSearchOptionSelected');
      suggestionElements[0].click();
      expect(substanceSearchOptionSelectedSpy.mock.calls.length).toBe(1);

      // Can't get this part of the test to work, get back to it in the future
      // expect(routerStub.navigate).toHaveBeenCalledTimes(1);
      // const navigationExtras = routerStub.navigate.calls.mostRecent().args[1] as NavigationExtras;
      // expect(navigationExtras.queryParams['search_term']).toBe('BUTYRIC ACID, 4-(P-ARSENOSOPHENYL)-');
    });

    it('when search button is clicked, should call function and route to browse page with value as parameter', async () => {
      await fixture.whenStable();
      const substanceSearchClickedSpy = vi.spyOn(component, 'processSubstanceSearch');
      const searchButtonElement: HTMLButtonElement = fixture.nativeElement.querySelector('.search-button');
      searchButtonElement.click();
      expect(substanceSearchClickedSpy.mock.calls.length).toBe(1);

      // fixture.detectChanges();
      // expect(routerStub.navigate).toHaveBeenCalledTimes(1);
      // const navigationExtras = routerStub.navigate.calls.mostRecent().args[1] as NavigationExtras;
      // expect(navigationExtras.queryParams['search_term']).toBe('BUTYRIC ACID, 4-(P-ARSENOSOPHENYL)-');
    });

  });
});
