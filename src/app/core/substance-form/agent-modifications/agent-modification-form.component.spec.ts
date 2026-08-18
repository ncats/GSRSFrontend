import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { of } from 'rxjs';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { UtilsService } from '@gsrs-core/utils';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { AgentModification } from '@gsrs-core/substance';
import { vi } from 'vitest';

import { AgentModificationFormComponent } from './agent-modification-form.component';

describe('AgentModificationFormComponent', () => {
  let component: AgentModificationFormComponent;
  let fixture: ComponentFixture<AgentModificationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentModificationFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        // ngOnInit calls cvService.getDomainVocabulary(...) unconditionally.
        {
          provide: ControlledVocabularyService,
          useValue: {
            getDomainVocabulary: vi.fn().mockReturnValue(of({
              AGENT_MODIFICATION_TYPE: { list: [] },
              AGENT_MODIFICATION_PROCESS: { list: [] },
              ROLE: { list: [] }
            }))
          }
        },
        { provide: MatDialog, useValue: {} },
        { provide: UtilsService, useValue: {} },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: SubstanceFormService, useValue: {} }
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
