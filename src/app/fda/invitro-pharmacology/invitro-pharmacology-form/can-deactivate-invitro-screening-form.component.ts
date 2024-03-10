import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { InvitroPharmacologyFormComponent } from './invitro-pharmacology-form.component';
import { InvitroPharmacologyService } from '../service/invitro-pharmacology.service';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateInvitroScreeningFormComponent implements CanDeactivate<InvitroPharmacologyFormComponent> {
  constructor(
    private invitroPharmacologyService: InvitroPharmacologyService
  ) {}
  canDeactivate(component: InvitroPharmacologyFormComponent): boolean {
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
