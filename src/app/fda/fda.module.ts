import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FdaSampleComponent } from './fda-sample/fda-sample.component';
import { Router } from '@angular/router';
import { FdaInheritanceSampleComponent } from './inheritance-sample/fda-inheritance-sample/fda-inheritance-sample.component';
import { DynamicComponentLoaderModule } from '../core/dynamic-component-loader/dynamic-component-loader.module';
import { fdaDynamicComponentManifests } from './fda-dynamic-componet-manifests';

const fdaRoutes: Routes = [
  // {
  //   path: 'fda-sample-path',
  //   component: FdaSampleComponent
  // },
  // {
  //   path: 'fda-sample-inheritance',
  //   component: FdaInheritanceSampleComponent
  // }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(fdaRoutes),
    DynamicComponentLoaderModule.forRoot(fdaDynamicComponentManifests),
  ],
  declarations: [
    FdaSampleComponent,
    FdaInheritanceSampleComponent
  ],
  exports: [
    FdaSampleComponent,
    FdaInheritanceSampleComponent
  ]
})
export class FdaModule {
  constructor(router: Router) {
    fdaRoutes.forEach(route => {
      router.config[0].children.push(route);
    });
  }
}
