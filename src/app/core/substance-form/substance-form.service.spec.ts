import { TestBed, inject } from '@angular/core/testing';

import { SubstanceFormService } from './substance-form.service';

describe('SubstanceFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubstanceFormService]
    });
  });

  it('should be created', inject([SubstanceFormService], (service: SubstanceFormService) => {
    expect(service).toBeTruthy();
  }));

  it('pairedSiteString formats sites as bonded pairs in click order, without sorting',
    inject([SubstanceFormService], (service: SubstanceFormService) => {
      const sites = [
        { subunitIndex: 1, residueIndex: 269 },
        { subunitIndex: 1, residueIndex: 329 },
        { subunitIndex: 1, residueIndex: 156 },
        { subunitIndex: 1, residueIndex: 443 }
      ];
      expect(service.pairedSiteString(sites)).toBe('1_269-1_329; 1_156-1_443');
    }));

  it('pairedSiteString shows a leftover unpaired site on its own',
    inject([SubstanceFormService], (service: SubstanceFormService) => {
      const sites = [
        { subunitIndex: 1, residueIndex: 269 },
        { subunitIndex: 1, residueIndex: 329 },
        { subunitIndex: 1, residueIndex: 156 }
      ];
      expect(service.pairedSiteString(sites)).toBe('1_269-1_329; 1_156');
    }));

  it('pairedSiteString returns empty string for no sites',
    inject([SubstanceFormService], (service: SubstanceFormService) => {
      expect(service.pairedSiteString([])).toBe('');
      expect(service.pairedSiteString(null)).toBe('');
    }));
});
