import { TestBed, inject } from '@angular/core/testing';
import { ImpuritiesService } from '../service/impurities.service';

import { CanDeactivateImpuritiesFormComponent } from './can-deactivate-impurities-form.component';

describe('CanDeactivateImpuritiesFormComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CanDeactivateImpuritiesFormComponent,
        { provide: ImpuritiesService, useValue: {} }
      ]
    });
  });

  it('should create', inject([CanDeactivateImpuritiesFormComponent], (guard: CanDeactivateImpuritiesFormComponent) => {
    expect(guard).toBeTruthy();
  }));
});
