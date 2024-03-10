import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { InvitroPharmacologyAssayFormComponent } from './invitro-pharmacology-assay-form/invitro-pharmacology-assay-form.component';
import { InvitroPharmacologyService } from '../service/invitro-pharmacology.service';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateInvitroAssayFormComponent implements CanDeactivate<InvitroPharmacologyAssayFormComponent> {
  constructor(
    private invitroPharmacologyService: InvitroPharmacologyService
  ) {}
  canDeactivate(component: InvitroPharmacologyAssayFormComponent): boolean {
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
