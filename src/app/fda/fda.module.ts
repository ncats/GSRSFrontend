import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { DynamicComponentLoaderModule } from '@gsrs-core/dynamic-component-loader';
import { fdaDynamicComponentManifests } from './fda-dynamic-componet-manifests';
import { SubstanceCardsModule } from '@gsrs-core/substance-details';
import { fdaSubstanceCardsFilters } from './substance-details/fda-substance-cards-filters.constant';
import { ProductService } from './product/product.service';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { MatCardModule } from '@angular/material/card';
import { ClinicalTrialsModule } from './clinical-trials/clinical-trials.module';
import { FacetDisplayPipe } from './utils/facet-display.pipe';
import { FacetFilterPipe } from './utils/facet-filter.pipe';



const fdaRoutes: Routes = [
  {
    path: 'products/:id',
    component: ProductDetailsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(fdaRoutes),
    DynamicComponentLoaderModule.forRoot(fdaDynamicComponentManifests),
    SubstanceCardsModule.forRoot(fdaSubstanceCardsFilters),
    MatCardModule,
    ClinicalTrialsModule.forRoot()
  ],
  declarations: [ProductDetailsComponent, FacetDisplayPipe, FacetFilterPipe],
  exports: []
  
})
export class FdaModule {
  constructor(
    router: Router
  ) {
    fdaRoutes.forEach(route => {
      router.config[0].children.push(route);
    });
  }
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FdaModule,
      providers: [
        ProductService
      ]
    };
  }
}
