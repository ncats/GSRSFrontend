import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { AuthService } from '@gsrs-core/auth';

import { SubstanceDependenciesImageComponent } from './substance-dependencies-image.component';

describe('SubstanceDisplayImageComponent', () => {
  let component: SubstanceDependenciesImageComponent;
  let fixture: ComponentFixture<SubstanceDependenciesImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceDependenciesImageComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SubstanceService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: GoogleAnalyticsService, useValue: { sendEvent: () => null } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => ({ subscribe: () => null }) }) } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceDependenciesImageComponent);
    component = fixture.componentInstance;
    component.substance = { uuid: 'test-uuid', relationships: [] } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
