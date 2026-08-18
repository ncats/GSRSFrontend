import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { SubstanceService } from '../substance/substance.service';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { ConfigService } from '@gsrs-core/config';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StructureService } from '@gsrs-core/structure';
import { SubstanceSelectorComponent } from './substance-selector.component';

describe('SubstanceSelectorComponent', () => {
  let component: SubstanceSelectorComponent;
  let fixture: ComponentFixture<SubstanceSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ SubstanceSelectorComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SubstanceService, useValue: {} },
        { provide: SubstanceFormService, useValue: { getStoredRelated: () => ({}) } },
        { provide: ConfigService, useValue: { configData: {}, environment: {}, afterLoad: () => Promise.resolve({}) } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: ScrollToService, useValue: {} },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), events: of({}), url: '', routerState: { snapshot: { url: '' } }, createUrlTree: () => ({}), serializeUrl: () => '', routeReuseStrategy: { shouldReuseRoute: () => false } } },
        { provide: StructureService, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
