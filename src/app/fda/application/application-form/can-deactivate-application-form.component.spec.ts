import { TestBed, inject } from '@angular/core/testing';
import { ApplicationService } from '../service/application.service';

import { CanDeactivateApplicationFormComponent } from './can-deactivate-application-form.component';

describe('CanDeactivateApplicationFormComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CanDeactivateApplicationFormComponent,
        { provide: ApplicationService, useValue: {} }
      ]
    });
  });

  it('should create', inject([CanDeactivateApplicationFormComponent], (guard: CanDeactivateApplicationFormComponent) => {
    expect(guard).toBeTruthy();
  }));
});
