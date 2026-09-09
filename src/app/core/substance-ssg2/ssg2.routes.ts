import { Routes } from '@angular/router';
import { SubstanceSsg2FormComponent } from './substance-ssg2-form.component';

export const SSG2_ROUTES: Routes = [
  {
    path: 'substances-ssg2/register',
    component: SubstanceSsg2FormComponent
  },
  {
    path: 'substances-ssg2/:id/edit',
    component: SubstanceSsg2FormComponent
  }
];
