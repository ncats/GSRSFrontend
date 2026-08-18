import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, NEVER } from 'rxjs';
import { vi } from 'vitest';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ActivatedRoute, Router } from '@angular/router';
import { SubstanceFormService } from '../substance-form.service';
import { StructureService } from '../../structure/structure.service';
import { LoadingService } from '../../loading/loading.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { SubstanceFormStructuralUnitsService } from '../structural-units/substance-form-structural-units.service';
import { SubstanceFormStructureService } from './substance-form-structure.service';
import { ConfigService } from '@gsrs-core/config';

import { SubstanceFormStructureCardComponent } from './substance-form-structure-card.component';

describe('SubstanceFormStructureComponent', () => {
  let component: SubstanceFormStructureCardComponent;
  let fixture: ComponentFixture<SubstanceFormStructureCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceFormStructureCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SubstanceFormService, useValue: { definition: NEVER, resolvedMol: NEVER } },
        { provide: SubstanceFormStructureService, useValue: {} },
        { provide: StructureService, useValue: {} },
        { provide: LoadingService, useValue: { setLoading: () => null } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => NEVER }) } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: GoogleAnalyticsService, useValue: { sendEvent: () => null } },
        { provide: SubstanceService, useValue: {} },
        { provide: SubstanceFormStructuralUnitsService, useValue: {} },
        { provide: ActivatedRoute, useValue: { snapshot: { routeConfig: { path: '' }, queryParams: {} } } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: ConfigService, useValue: { configData: {} } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormStructureCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('SubstanceFormStructureCardComponent structure updates', () => {
  const molfileWithoutRemovedIsotope = [
    'test',
    '  GSRS',
    '',
    '  2  1  0  0  0  0            999 V2000',
    '    0.0000    0.0000    0.0000 Pb  0  0  0  0  0  0  0  0  0  0  0  0',
    '    1.0000    0.0000    0.0000 N   0  3  0  0  0  0  0  0  0  0  0  0',
    '  1  2  1  0  0  0  0',
    'M  ISO  1   1 204',
    'M  CHG  1   2   1',
    'M  END',
  ].join('\n');

  function createComponentForUpdate(): {
    component: SubstanceFormStructureCardComponent;
    interpretStructure: ReturnType<typeof vi.fn>;
  } {
    const component = Object.create(
      SubstanceFormStructureCardComponent.prototype,
    ) as SubstanceFormStructureCardComponent;
    const interpretStructure = vi.fn().mockReturnValue(of({
      structure: { smiles: '[204Pb][N+]' },
    }));

    component.isInitializing = false;
    component.structure = { molfile: 'original molfile' } as any;
    (component as any).structureService = { interpretStructure };
    vi.spyOn(component, 'processStructurePostResponse');

    return { component, interpretStructure };
  }

  it('keeps an intentional isotope removal emitted by the editor', () => {
    const { component, interpretStructure } = createComponentForUpdate();

    component.updateStructureForm(molfileWithoutRemovedIsotope);

    expect(interpretStructure.mock.calls.length).toBe(1);
    expect(interpretStructure.mock.calls[0][0]).toBe(molfileWithoutRemovedIsotope);
    expect(component.structure.molfile).toBe(molfileWithoutRemovedIsotope);
    expect(component.structure.molfile).not.toContain('  2  15');
  });

  it('does not mutate structure during programmatic initialization', () => {
    const { component, interpretStructure } = createComponentForUpdate();
    component.isInitializing = true;

    component.updateStructureForm(molfileWithoutRemovedIsotope);

    expect(interpretStructure.mock.calls.length).toBe(0);
    expect(component.structure.molfile).toBe('original molfile');
  });
});
