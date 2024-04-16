import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { InvitroPharmacologySummaryFormComponent } from './invitro-pharmacology-summary-form/invitro-pharmacology-summary-form.component';
import { InvitroPharmacologyService } from '../service/invitro-pharmacology.service';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateInvitroSummaryFormComponent implements CanDeactivate<InvitroPharmacologySummaryFormComponent> {
  constructor(
    private invitroPharmacologyService: InvitroPharmacologyService
  ) {}
  canDeactivate(component: InvitroPharmacologySummaryFormComponent): boolean {
    if (this.invitroPharmacologyService.isInvitroPharmacologyUpdated) {
      if (confirm('You have unsaved changes! If you leave, your changes will be lost.')) {
          return true;
      } else {
          return false;
      }
    }
    return true;
  }
}
