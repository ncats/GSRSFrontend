import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { BrowseSubstanceComponent } from './browse-substance.component';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SubstanceListData } from '../../testing/substance-list-test-data';
import { of, throwError } from 'rxjs';
import { asyncData, asyncError } from '../../testing/async-observable-helpers';

describe('BrowseSubstanceComponent', () => {
  let component: BrowseSubstanceComponent;
  let fixture: ComponentFixture<BrowseSubstanceComponent>;
  let activatedRouteStub: Partial<ActivatedRoute>;
  let getSubtanceDetailsSpy: jasmine.Spy;

  beforeEach(async(() => {

    activatedRouteStub = new ActivatedRouteStub({ 'search_term': '' });

    const substanceServiceSpy = jasmine.createSpyObj('SubstanceService', ['getSubtanceDetails']);
    getSubtanceDetailsSpy = substanceServiceSpy.getSubtanceDetails.and.returnValue(asyncData(SubstanceListData));

    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['setLoading']);

    TestBed.configureTestingModule({
      imports: [
        MatExpansionModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatCardModule,
        MatChipsModule,
        MatBadgeModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [
        BrowseSubstanceComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: SubstanceService, useValue: substanceServiceSpy },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseSubstanceComponent);
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
    expect(component.facetParams).toEqual({}, 'facetParams should be an empty object');
  });

  it('OnInit, searchTerm should be initialized and getSubstanceDetails should be called', () => {
    fixture.detectChanges();
    expect(component.searchTerm).toBeDefined('searchTerm should be initialized');
    expect(getSubtanceDetailsSpy.calls.any()).toBe(true, 'getSubtanceDetails called');
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
  })
});
