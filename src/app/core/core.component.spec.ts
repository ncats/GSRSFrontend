import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA} from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CoreComponent } from './core.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoadingModule } from '../loading/loading.module';
import { UtilsService } from '../utils/utils.service';
import { RouterStub } from '../../testing/router-stub';
import { RouterLinkDirectiveStub } from '../../testing/router-link-directive-stub';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { asyncData, asyncError } from '../../testing/async-observable-helpers';
import { SubstanceData } from '../../testing/substance-suggestion-test-data';
import { Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { tick } from '../../../node_modules/@angular/core/src/render3';

describe('CoreComponent', () => {
  let component: CoreComponent;
  let fixture: ComponentFixture<CoreComponent>;
  let routerStub: RouterStub;
  let getStructureSearchSuggestionsSpy: jasmine.Spy;
  let overlayContainerElement;

  beforeEach(async(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;

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
        BrowserAnimationsModule
      ],
      declarations: [
        CoreComponent,
        RouterLinkDirectiveStub
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: UtilsService, useValue: utilsServiceSpy },
        { provide: Router, useValue: routerStub }
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
        // component.searchControl.setValue('test');
        // can't test changes on the view triggering lookahead because of known bug https://github.com/angular/angular/issues/7549
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

      it('should click call on suggestion selected event handler', async(() => {
        fixture.whenStable().then(() => {
          setTimeout(() => {
            const substanceSearchOptionSelectedSpy = spyOn<CoreComponent>(component, 'substanceSearchOptionSelected');
            const suggestionElement: HTMLElement = suggestionElements[1];
            suggestionElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              console.log(component.mainPathSegment);
              expect(substanceSearchOptionSelectedSpy).toHaveBeenCalled();
            });
          }, 502);
        });
      }));

    });
  });
});
