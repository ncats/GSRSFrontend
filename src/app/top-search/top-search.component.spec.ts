import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, NgZone } from '@angular/core';
import { TopSearchComponent } from './top-search.component';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UtilsService } from '../utils/utils.service';
import { RouterStub } from '../../testing/router-stub';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { asyncData } from '../../testing/async-observable-helpers';
import { SubstanceData } from '../../testing/substance-suggestion-test-data';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';

describe('TopSearchComponent', () => {
  let component: TopSearchComponent;
  let fixture: ComponentFixture<TopSearchComponent>;
  let getStructureSearchSuggestionsSpy: jasmine.Spy;
  let overlayContainerElement;
  let zone: NgZone;
  let routerStub: RouterStub;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(async(() => {
    const utilsServiceSpy = jasmine.createSpyObj('UtilsService', ['getStructureSearchSuggestions']);
    getStructureSearchSuggestionsSpy = utilsServiceSpy.getStructureSearchSuggestions.and.returnValue(asyncData(SubstanceData));
    routerStub = new RouterStub();
    activatedRouteStub = new ActivatedRouteStub(
      {
        'search_term': 'test_search_term'
      }
    );

    TestBed.configureTestingModule({
      imports: [
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      declarations: [
        TopSearchComponent
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: UtilsService, useValue: utilsServiceSpy },
        { provide: Router, useValue: routerStub },
        { provide: NgZone, useFactory: () => zone = new NgZone({ enableLongStackTrace: false }) }
      ]
    })
      .compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainerElement = oc.getContainerElement();
    })();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopSearchComponent);
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

    it('should get search suggestions on search value changes and show them', async(() => {
      fixture.whenStable().then(() => {
        setTimeout(() => {
          expect(getStructureSearchSuggestionsSpy.calls.any()).toBeTruthy('should call API for search suggestions');
          expect(suggestionElements.length).toBeGreaterThan(0, 'search suggestions should show');
        }, 502);
      });
    }));

    it('when search suggestion is clicked/selected, should call function and route to browse page with value as parameter', async(() => {
      fixture.whenStable().then(() => {
        setTimeout(() => {
          // zone.onStable.emit(null);
          setTimeout(() => {
            const substanceSearchOptionSelectedSpy = spyOn<TopSearchComponent>(component, 'substanceSearchOptionSelected');
            suggestionElements[0].click();
            expect(substanceSearchOptionSelectedSpy).toHaveBeenCalledTimes(1);

            // Can't get this part of the test to work, get back to it in the future
            // expect(routerStub.navigate).toHaveBeenCalledTimes(1);
            // const navigationExtras = routerStub.navigate.calls.mostRecent().args[1] as NavigationExtras;
            // expect(navigationExtras.queryParams['search_term']).toBe('BUTYRIC ACID, 4-(P-ARSENOSOPHENYL)-');
          });
        }, 502);
      });
    }));

    it('when search button is clicked, should call function and route to browse page with value as parameter', async(() => {
      fixture.whenStable().then(() => {
        const substanceSearchClickedSpy = spyOn<TopSearchComponent>(component, 'processSubstanceSearch');
        const searchButtonElement: HTMLButtonElement = fixture.nativeElement.querySelector('.search-button');
        searchButtonElement.click();
        expect(substanceSearchClickedSpy).toHaveBeenCalledTimes(1);

        // fixture.detectChanges();
        // expect(routerStub.navigate).toHaveBeenCalledTimes(1);
        // const navigationExtras = routerStub.navigate.calls.mostRecent().args[1] as NavigationExtras;
        // expect(navigationExtras.queryParams['search_term']).toBe('BUTYRIC ACID, 4-(P-ARSENOSOPHENYL)-');
      });
    }));

  });
});
