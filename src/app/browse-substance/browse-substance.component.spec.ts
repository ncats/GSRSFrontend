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

describe('BrowseSubstanceComponent', () => {
  let component: BrowseSubstanceComponent;
  let fixture: ComponentFixture<BrowseSubstanceComponent>;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(async(() => {

    activatedRouteStub = new ActivatedRouteStub({ 'search_term': '' });
    const substanceServiceSpy = jasmine.createSpyObj('SubstanceService', ['getSubtanceDetails', 'getSubstanceSummaries']);
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
