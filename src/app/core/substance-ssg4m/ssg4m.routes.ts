import { Routes } from '@angular/router';
import { SubstanceSsg4ManufactureFormComponent } from './substance-ssg4m-form.component';

export const SSG4M_ROUTES: Routes = [
  {
    path: 'substances-ssg4m/register',
    component: SubstanceSsg4ManufactureFormComponent
  },
  {
    path: 'substances-ssg4m/:id/edit',
    component: SubstanceSsg4ManufactureFormComponent
  }
];
