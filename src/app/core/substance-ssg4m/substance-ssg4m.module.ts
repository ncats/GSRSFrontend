import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, Routes, RouterModule } from '@angular/router';
import { SubstanceSsg4mService } from './substance-ssg4m-form.service';
import { SubstanceFormSsg4mProcessService } from './ssg4m-process/substance-form-ssg4m-process.service';
import { SubstanceSsg4ManufactureFormComponent } from './substance-ssg4m-form.component';

const ssg4mRoutes: Routes = [
  {
    path: 'substances-ssg4m/register',
    component: SubstanceSsg4ManufactureFormComponent
    //  canActivate: [CanRegisterSubstanceForm],
    //  canDeactivate: [CanDeactivateSubstanceFormGuard]
  },
  {
    path: 'substances-ssg4m/:id/edit',
    component: SubstanceSsg4ManufactureFormComponent,
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
    RouterModule.forChild(ssg4mRoutes),
    RouterModule,
    CommonModule,
    SubstanceSsg4ManufactureFormComponent
  ],
  exports: [
  ]
})

export class SubstanceSsg4mModule {
  constructor(router: Router) {
    ssg4mRoutes.forEach(route => {
      router.config[0].children.push(route);
    });
  }

  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: SubstanceSsg4mModule,
      providers: [
     //   SubstanceSsg4mService,
     //   SubstanceFormSsg4mProcessService,
     //   SubstanceFormSsg4mSitesService
      ]
    };
  }
}
