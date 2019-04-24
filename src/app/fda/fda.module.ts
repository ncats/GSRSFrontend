import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { DynamicComponentLoaderModule } from '@gsrs-core/dynamic-component-loader/dynamic-component-loader.module';
import { fdaDynamicComponentManifests } from './fda-dynamic-componet-manifests';
import { SubstanceCardsModule } from '@gsrs-core/substance-details/substance-cards.module';
import { fdaSubstanceCardsFilters } from './substance-details/fda-substance-cards-filters.constant';
import { ProductService } from './product/product.service';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { MatCardModule } from '@angular/material/card';

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
    MatCardModule
  ],
  declarations: [ProductDetailsComponent],
  providers: [
    ProductService
  ],
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
}
