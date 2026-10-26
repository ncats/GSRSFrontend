import { TestBed, inject } from '@angular/core/testing';
import { InvitroPharmacologyService } from '../service/invitro-pharmacology.service';

import { CanDeactivateInvitroSummaryFormComponent } from './can-deactivate-invitro-summary-form.component';

describe('CanDeactivateInvitroSummaryFormComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CanDeactivateInvitroSummaryFormComponent,
        { provide: InvitroPharmacologyService, useValue: {} }
      ]
    });
  });

  it('should create', inject([CanDeactivateInvitroSummaryFormComponent], (guard: CanDeactivateInvitroSummaryFormComponent) => {
    expect(guard).toBeTruthy();
  }));
});
