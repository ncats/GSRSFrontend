import { TestBed, inject } from '@angular/core/testing';
import { InvitroPharmacologyService } from '../service/invitro-pharmacology.service';

import { CanDeactivateInvitroScreeningFormComponent } from './can-deactivate-invitro-screening-form.component';

describe('CanDeactivateInvitroScreeningFormComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CanDeactivateInvitroScreeningFormComponent,
        { provide: InvitroPharmacologyService, useValue: {} }
      ]
    });
  });

  it('should create', inject([CanDeactivateInvitroScreeningFormComponent], (guard: CanDeactivateInvitroScreeningFormComponent) => {
    expect(guard).toBeTruthy();
  }));
});
