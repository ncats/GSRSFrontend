import { Routes } from "@angular/router";
import { ApplicationsBrowseComponent } from "./applications-browse/applications-browse.component";
import { ApplicationLoadedComponent } from "./application-loaded.component";
import { ApplicationFormComponent } from "./application-form/application-form.component";
import { CanActivateRegisterApplicationFormComponent } from "./application-form/can-activate-register-application-form.component";
import { CanDeactivateApplicationFormComponent } from "./application-form/can-deactivate-application-form.component";
import { CanActivateUpdateApplicationFormComponent } from "./application-form/can-activate-update-application-form.component";
import { ApplicationDetailsComponent } from "./application-details/application-details/application-details.component";
import { ApplicationDarrtsDetailsComponent } from "./application-details/application-darrts-details/application-darrts-details.component";

export const APPLICATION_ROUTES: Routes = [
    {
    path: 'browse-applications',
    component: ApplicationsBrowseComponent,
    canActivate: [ApplicationLoadedComponent],

  },
  {
    path: 'application/register',
    component: ApplicationFormComponent,
    canActivate: [ApplicationLoadedComponent, CanActivateRegisterApplicationFormComponent],
    canDeactivate: [CanDeactivateApplicationFormComponent]
  },
  {
    path: 'application/:id/edit',
    component: ApplicationFormComponent,
    canActivate: [ApplicationLoadedComponent, CanActivateUpdateApplicationFormComponent],
    canDeactivate: [CanDeactivateApplicationFormComponent]
  },
  {
    path: 'application/:id',
    component: ApplicationDetailsComponent,
    canActivate: [ApplicationLoadedComponent]
  },
  {
    path: 'application/:appType/:appNumber',
    component: ApplicationDetailsComponent,
    canActivate: [ApplicationLoadedComponent]
  },
  {
    path: 'application-darrts/:appType/:appNumber',
    component: ApplicationDarrtsDetailsComponent,
    canActivate: [ApplicationLoadedComponent]
  }
]