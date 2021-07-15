import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ImpuritiesFormComponent } from './impurities-form.component';
import { ImpuritiesService } from '../service/impurities.service';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateImpuritiesFormComponent implements CanDeactivate<ImpuritiesFormComponent> {
  constructor(
    private impuritiesService: ImpuritiesService
  ) {}
  canDeactivate(component: ImpuritiesFormComponent): boolean {
    if (this.impuritiesService.isImpuritiesUpdated) {
      if (confirm('You have unsaved changes! If you leave, your changes will be lost.')) {
          return true;
      } else {
          return false;
      }
    }
    return true;
  }
}
