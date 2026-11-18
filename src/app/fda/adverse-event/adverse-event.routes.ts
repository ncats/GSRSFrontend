import { Routes } from "@angular/router";
import { AdverseEventsBrowseComponent } from "./adverse-events-browse/adverse-events-browse.component";
import { ActivateAdverseeventsComponent } from "./activate-adverse-events.component";
import { AdverseEventsPtBrowseComponent } from "./adverse-events-pt-browse/adverse-events-pt-browse.component";
import { AdverseEventsDmeBrowseComponent } from "./adverse-events-dme-browse/adverse-events-dme-browse.component";
import { AdverseEventsCvmBrowseComponent } from "./adverse-events-cvm-browse/adverse-events-cvm-browse.component";

export const ADVERSE_EVENT_ROUTES: Routes = [
    {
    path: 'browse-adverse-events',
    component: AdverseEventsBrowseComponent,
    canActivate: [ActivateAdverseeventsComponent]
  },
  {
    path: 'adverse-event-pt-browse',
    component: AdverseEventsPtBrowseComponent,
    canActivate: [ActivateAdverseeventsComponent]
  },
  {
    path: 'adverse-event-dme-browse',
    component: AdverseEventsDmeBrowseComponent,
    canActivate: [ActivateAdverseeventsComponent]
  },
  {
    path: 'adverse-event-cvm-browse',
    component: AdverseEventsCvmBrowseComponent,
    canActivate: [ActivateAdverseeventsComponent]
  }
]