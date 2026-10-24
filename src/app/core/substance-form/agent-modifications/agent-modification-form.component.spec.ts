import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { of } from 'rxjs';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { UtilsService } from '@gsrs-core/utils';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { ConfigService } from '@gsrs-core/config';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { Router } from '@angular/router';
import { StructureService } from '@gsrs-core/structure/structure.service';
import { DataDictionaryService } from '@gsrs-core/utils/data-dictionary.service';
import { AuthService } from '@gsrs-core/auth';
import { AgentModification } from '@gsrs-core/substance';
import { vi } from 'vitest';

import { AgentModificationFormComponent } from './agent-modification-form.component';

describe('AgentModificationFormComponent', () => {
  let component: AgentModificationFormComponent;
  let fixture: ComponentFixture<AgentModificationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AgentModificationFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        // ngOnInit calls cvService.getDomainVocabulary(...) unconditionally.
        {
          provide: ControlledVocabularyService,
          useValue: {
            getDomainVocabulary: vi.fn().mockReturnValue(of({
              AGENT_MODIFICATION_TYPE: { list: [] },
              AGENT_MODIFICATION_PROCESS: { list: [] },
              ROLE: { list: [] },
              // also called by the real, standalone app-access-manager/app-substance-text-search
              // children this component's template now renders for real.
              ACCESS_GROUP: { list: [] },
              CODE_SYSTEM: { dictionary: {} }
            }))
          }
        },
        { provide: MatDialog, useValue: {} },
        { provide: UtilsService, useValue: {} },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        // also injected by the real, standalone app-substance-selector/app-cv-input children
        // this component's template now renders for real.
        { provide: SubstanceFormService, useValue: { getStoredRelated: () => null } },
        { provide: SubstanceService, useValue: {} },
        { provide: ConfigService, useValue: { configData: {}, afterLoad: () => Promise.resolve({}) } },
        { provide: ScrollToService, useValue: {} },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), events: of({}), url: '', routerState: { snapshot: { url: '' } }, createUrlTree: () => ({}), serializeUrl: () => '', routeReuseStrategy: { shouldReuseRoute: () => false } } },
        { provide: StructureService, useValue: {} },
        { provide: DataDictionaryService, useValue: { getDictionaryRow: () => ({ fieldName: 'test', CVDomain: 'AGENT_MODIFICATION_TYPE' }) } },
        { provide: AuthService, useValue: { hasPrivilege: () => false, getAuth: () => of(null) } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentModificationFormComponent);
    component = fixture.componentInstance;
    // template reads mod.$$deletedCode with no safe-navigation guard.
    component.mod = {} as AgentModification;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
