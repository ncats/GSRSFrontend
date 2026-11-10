import { TestBed, inject } from '@angular/core/testing';
import { InvitroPharmacologyService } from '../service/invitro-pharmacology.service';

import { CanDeactivateInvitroAssayFormComponent } from './can-deactivate-invitro-assay-form.component';

describe('CanDeactivateInvitroAssayFormComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CanDeactivateInvitroAssayFormComponent,
        { provide: InvitroPharmacologyService, useValue: {} }
      ]
    });
  });

  it('should create', inject([CanDeactivateInvitroAssayFormComponent], (guard: CanDeactivateInvitroAssayFormComponent) => {
    expect(guard).toBeTruthy();
  }));
});
