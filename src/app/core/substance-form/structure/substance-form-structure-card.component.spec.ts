import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { SubstanceFormStructureCardComponent } from './substance-form-structure-card.component';

describe('SubstanceFormStructureComponent', () => {
  let component: SubstanceFormStructureCardComponent;
  let fixture: ComponentFixture<SubstanceFormStructureCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormStructureCardComponent ]
    })
    .compileComponents();
  }));

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
    interpretStructure: jasmine.Spy;
  } {
    const component = Object.create(
      SubstanceFormStructureCardComponent.prototype,
    ) as SubstanceFormStructureCardComponent;
    const interpretStructure = jasmine.createSpy('interpretStructure').and.returnValue(of({
      structure: { smiles: '[204Pb][N+]' },
    }));

    component.isInitializing = false;
    component.structure = { molfile: 'original molfile' } as any;
    (component as any).structureService = { interpretStructure };
    spyOn(component, 'processStructurePostResponse');

    return { component, interpretStructure };
  }

  it('keeps an intentional isotope removal emitted by the editor', () => {
    const { component, interpretStructure } = createComponentForUpdate();

    component.updateStructureForm(molfileWithoutRemovedIsotope);

    expect(interpretStructure).toHaveBeenCalledWith(molfileWithoutRemovedIsotope);
    expect(component.structure.molfile).toBe(molfileWithoutRemovedIsotope);
    expect(component.structure.molfile).not.toContain('  2  15');
  });

  it('does not mutate structure during programmatic initialization', () => {
    const { component, interpretStructure } = createComponentForUpdate();
    component.isInitializing = true;

    component.updateStructureForm(molfileWithoutRemovedIsotope);

    expect(interpretStructure).not.toHaveBeenCalled();
    expect(component.structure.molfile).toBe('original molfile');
  });
});
