import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ClinicalTrialUSFormComponent } from './clinical-trial-us-form.component';
import { ClinicalTrialUSService } from '../service/clinical-trial-us.service';

@Injectable({
  providedIn: 'root'
})

export class CanDeactivateClinicalTrialUSFormComponent implements CanDeactivate<ClinicalTrialUSFormComponent> {
  constructor(
    private clinicalTrialUSService: ClinicalTrialUSService
  ) {}
  canDeactivate(component: ClinicalTrialUSFormComponent): boolean {
    if (this.clinicalTrialUSService.isClinicalTrialUSUpdated) {
      if (confirm('You have unsaved changes! If you leave, your changes will be lost.')) {
          return true;
      } else {
          return false;
      }
    }
    return true;
  }
}
