import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';
import { UtilsService } from '@gsrs-core/utils';
import { vi } from 'vitest';

import { GuidedSearchComponent } from './guided-search.component';

describe('GuidedSearchComponent', () => {
  let component: GuidedSearchComponent;
  let fixture: ComponentFixture<GuidedSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuidedSearchComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: HttpClient, useValue: { get: vi.fn().mockReturnValue(of({})) } },
        { provide: Router, useValue: {} },
        { provide: ConfigService, useValue: { environment: { baseHref: '/ginas/app/beta/' } } },
        { provide: UtilsService, useValue: {} },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } },
        { provide: Title, useValue: { setTitle: vi.fn() } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuidedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
