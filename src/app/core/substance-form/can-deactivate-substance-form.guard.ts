import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { SubstanceFormComponent } from './substance-form.component';
import { SubstanceFormService } from './substance-form.service';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateSubstanceFormGuard implements CanDeactivate<SubstanceFormComponent> {
  constructor(
    private substanceFormService: SubstanceFormService
  ) {}
  canDeactivate(component: SubstanceFormComponent): boolean {
    if (this.substanceFormService.isSubstanceUpdated) {
      if (confirm('You have unsaved changes! If you leave, your changes will be lost.')) {
          return true;
      } else {
          return false;
      }
    }
    return true;
  }
}
