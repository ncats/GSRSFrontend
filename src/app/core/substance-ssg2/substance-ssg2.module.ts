import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { Router, Routes, RouterModule } from '@angular/router';
import { SubstanceSsg2FormService } from './substance-ssg2-form.service';
import { SubstanceSsg2FormComponent } from './substance-ssg2-form.component';

const ssg2Routes: Routes = [
  {
    path: 'substances-ssg2/register',
    component: SubstanceSsg2FormComponent
    //  canActivate: [CanRegisterSubstanceForm],
    //  canDeactivate: [CanDeactivateSubstanceFormGuard]
  },
  {
    path: 'substances-ssg2/:id/edit',
    component: SubstanceSsg2FormComponent,
    //  canActivate: [CanRegisterSubstanceForm],
    //  canDeactivate: [CanDeactivateSubstanceFormGuard]
  }
  // ,
  // {
  //  path: 'substances-ssg4m/:id',
  //  component: SubstanceSsg4ManufactureFormComponent
  // }
];

@NgModule({
  imports: [
    RouterModule.forChild(ssg2Routes),
    RouterModule,
    CommonModule,
    SubstanceSsg2FormComponent
  ],
  exports: [
  ]
})

export class SubstanceSsg2Module {
  constructor(router: Router) {
    ssg2Routes.forEach(route => {
      router.config[0].children.push(route);
    });
  }

  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: SubstanceSsg2Module,
      providers: [
       // SubstanceSsg2FormService
      ]
    };
  }
}


