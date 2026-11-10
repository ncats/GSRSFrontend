import { Routes } from "@angular/router";
import { ImportBrowseComponent } from "./import-browse/import-browse.component";
import { CanImportData } from "./can-import-data";
import { AdminComponent } from "./admin.component";
import { CanActivateAdmin } from "./can-activate-admin";

export const ADMIN_ROUTES: Routes = [
    {
    path: 'staging-area',
    component: ImportBrowseComponent,
    pathMatch: 'full',
    canActivate: [CanImportData]
  },
  {
    path: '',
    component: AdminComponent,
    canActivate: [CanActivateAdmin]
  },
  {
    path: ':function',
    component: AdminComponent,
    canActivate: [CanActivateAdmin]
  }
]