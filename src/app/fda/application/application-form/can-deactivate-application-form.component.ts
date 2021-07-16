import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ApplicationFormComponent } from './application-form.component';
import { ApplicationService } from '../service/application.service';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateApplicationFormComponent implements CanDeactivate<ApplicationFormComponent> {
  constructor(
    private applicationService: ApplicationService
  ) {}
  canDeactivate(component: ApplicationFormComponent): boolean {
    if (this.applicationService.isApplicationUpdated) {
      if (confirm('You have unsaved changes! If you leave, your changes will be lost.')) {
          return true;
      } else {
          return false;
      }
    }
    return true;
  }
}
