import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, ROUTES } from '@angular/router';
import { FdaSampleComponent } from './fda-sample/fda-sample.component';
import { Router } from '@angular/router';
import { FdaInheritanceSampleComponent } from './inheritance-sample/fda-inheritance-sample/fda-inheritance-sample.component';
import { DynamicComponentLoaderModule } from '@gsrs-core/dynamic-component-loader/dynamic-component-loader.module';
import { fdaDynamicComponentManifests } from './fda-dynamic-componet-manifests';
import { SubstanceCardsModule } from '@gsrs-core/substance-details/substance-cards.module';
import { fdaSubstanceCardsFilters } from './substance-details/fda-substance-cards-filters.constant';

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
    SubstanceCardsModule.forRoot(fdaSubstanceCardsFilters)
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
  constructor(
    router: Router
  ) {
    fdaRoutes.forEach(route => {
      router.config[0].children.push(route);
    });
  }
}
