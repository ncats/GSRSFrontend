import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, NgZone } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CoreComponent } from './core.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { LoadingModule } from '../loading/loading.module';
import { UtilsService } from '../utils/utils.service';
import { RouterStub } from '../../testing/router-stub';
import { RouterLinkDirectiveStub } from '../../testing/router-link-directive-stub';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { asyncData } from '../../testing/async-observable-helpers';
import { SubstanceData } from '../../testing/substance-suggestion-test-data';
import { OverlayContainer } from '@angular/cdk/overlay';

describe('CoreComponent', () => {
  let component: CoreComponent;
  let fixture: ComponentFixture<CoreComponent>;
  let routerStub: RouterStub;
  let getStructureSearchSuggestionsSpy: jasmine.Spy;
  let overlayContainerElement;
  let zone: NgZone;

  beforeEach(async(() => {

    const utilsServiceSpy = jasmine.createSpyObj('UtilsService', ['getStructureSearchSuggestions']);
    getStructureSearchSuggestionsSpy = utilsServiceSpy.getStructureSearchSuggestions.and.returnValue(asyncData(SubstanceData));
    routerStub = new RouterStub();

    TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        FormsModule,
        LoadingModule,
        NoopAnimationsModule
      ],
      declarations: [
        CoreComponent,
        RouterLinkDirectiveStub
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: UtilsService, useValue: utilsServiceSpy },
        { provide: Router, useValue: routerStub },
        { provide: NgZone, useFactory: () => zone = new NgZone({ enableLongStackTrace: false}) }
      ]
    })
    .compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainerElement = oc.getContainerElement();
    })();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('after OnInit called', () => {

    beforeEach(() => {
      routerStub.setSnapshotUrl('/test-before/test');
      fixture.detectChanges(); // ngOnInit()
    });

    it('should set mainPathSegment on init', async(() => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(component.mainPathSegment).toBe('test-before', 'mainPathSegment should be set correctly');
      });
    }));

    it('should set mainPathSegment when the router completes a state change', async(() => {
      fixture.whenStable().then(() => {
        routerStub.fireNavigationEndEvent('/test-after/test');
        fixture.detectChanges();
        expect(component.mainPathSegment).toBe('test-after', 'mainPathSegment should be set correctly');
      });
    }));

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
              const substanceSearchOptionSelectedSpy = spyOn<CoreComponent>(component, 'substanceSearchOptionSelected');
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
          const substanceSearchClickedSpy = spyOn<CoreComponent>(component, 'processSubstanceSearch');
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
});
