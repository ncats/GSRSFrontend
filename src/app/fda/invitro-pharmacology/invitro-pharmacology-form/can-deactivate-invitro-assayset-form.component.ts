import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { InvitroPharmacologyAssaysetFormComponent } from './invitro-pharmacology-assayset-form/invitro-pharmacology-assayset-form.component';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateInvitroAssaySetFormComponent implements CanDeactivate<InvitroPharmacologyAssaysetFormComponent> {
  canDeactivate(component: InvitroPharmacologyAssaysetFormComponent): boolean {
    if (component && component.hasUnsavedChanges()) {
      return confirm('You have unsaved changes! If you leave, your changes will be lost.');
    }
    return true;
  }
}
