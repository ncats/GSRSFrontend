import { Routes } from "@angular/router";
import { ImpuritiesFormComponent } from "./impurities-form/impurities-form.component";
import { ActivateImpuritiesComponent } from "./activate-impurities.component";
import { CanActivateRegisterImpuritiesFormComponent } from "./impurities-form/can-activate-register-impurities-form.component";
import { CanDeactivateImpuritiesFormComponent } from "./impurities-form/can-deactivate-impurities-form.component";
import { CanActivateUpdateImpuritiesFormComponent } from "./impurities-form/can-activate-update-impurities-form.component";
import { ImpuritiesDetailsComponent } from "./impurities-details/impurities-details.component";

export const IMPURITIES_ROUTES: Routes = [
    {
    path: 'impurities/register',
    component: ImpuritiesFormComponent,
    canActivate: [ActivateImpuritiesComponent, CanActivateRegisterImpuritiesFormComponent],
    canDeactivate: [CanDeactivateImpuritiesFormComponent]
  },
  {
    path: 'impurities/:id/edit',
    component: ImpuritiesFormComponent,
    canActivate: [ActivateImpuritiesComponent, CanActivateUpdateImpuritiesFormComponent],
    canDeactivate: [CanDeactivateImpuritiesFormComponent]
  },
  {
    path: 'impurities/:id',
    component: ImpuritiesDetailsComponent,
    canActivate: [ActivateImpuritiesComponent]
  }
]