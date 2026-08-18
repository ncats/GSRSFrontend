import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { OverlayContainer } from '@angular/cdk/overlay';
import { of } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth';
import { SubstanceTextSearchService } from '@gsrs-core/substance-text-search/substance-text-search.service';
import { vi } from 'vitest';

import { PfdaToolbarComponent } from './pfda-toolbar.component';

describe('PfdaToolbarComponent', () => {
  let component: PfdaToolbarComponent;
  let fixture: ComponentFixture<PfdaToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // template resolves #nav="matMenu" / #accountMenu="matMenu" exportAs bindings, which
      // NO_ERRORS_SCHEMA doesn't substitute for - needs the real MatMenu directive.
      imports: [ MatMenuModule ],
      declarations: [ PfdaToolbarComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Router, useValue: {} },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: convertToParamMap({}) },
            queryParamMap: of(convertToParamMap({}))
          }
        },
        {
          provide: ConfigService,
          useValue: {
            configData: { pfdaBaseUrl: '/', contactEmail: 'test@example.com', navItems: [] },
            environment: { baseHref: '/ginas/app/beta/' }
          }
        },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        {
          provide: SubstanceTextSearchService,
          useValue: {
            registerSearchComponent: vi.fn(),
            setSearchComponentValueEvent: vi.fn().mockReturnValue(of(''))
          }
        },
        // constructor subscribes to authService.getAuth() directly.
        { provide: AuthService, useValue: { getAuth: vi.fn().mockReturnValue(of(null)) } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PfdaToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
