import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
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
      imports: [ PfdaToolbarComponent ],
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
        // template reads authService.authState() directly.
        {
          provide: AuthService,
          useValue: {
            authState: signal(null),
            pfdaLogin: vi.fn().mockReturnValue(of(true)),
            getAuth: vi.fn().mockReturnValue(of(null)),
            logout: vi.fn()
          }
        }
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
