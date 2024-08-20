import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { OverlayModule } from '@angular/cdk/overlay';

/* GSRS Core Imports */
import { SubstanceSelectorModule } from '../../core/substance-selector/substance-selector.module';
import { SubstanceSearchSelectorModule } from '../substance-search-select/substance-search-selector.module';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { SubstanceFormModule } from '../../core/substance-form/substance-form.module';
import { FacetsManagerModule } from '@gsrs-core/facets-manager';

/* GSRS Product Imports */
import { ProductTextSearchModule } from './product-text-search/product-text-search.module';
import { ProductService } from './service/product.service';

import { ProductsBrowseComponent } from './products-browse/products-browse.component';
import { ProductDetailsBaseComponent } from './product-details/product-details-base.component';
import { ProductDetailsComponent } from './product-details/product-details/product-details.component';
import { ProductElistDetailsComponent } from './product-details/product-elist-details/product-elist-details.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductComponentFormComponent } from './product-form/product-component/product-component-form.component';
import { ProductLotFormComponent } from './product-form/product-lot-form/product-lot-form.component';
import { ProductIngredientFormComponent } from './product-form/product-ingredient-form/product-ingredient-form.component';
import { CanActivateRegisterProductFormComponent } from './product-form/can-activate-register-product-form.component';
import { CanActivateUpdateProductFormComponent } from './product-form/can-activate-update-product-form.component';
import { CanDeactivateProductFormComponent } from './product-form/can-deactivate-product-form.component';
import { ActivateProductsComponent } from './activate-products.component';


const productRoutes: Routes = [
  {
    path: 'browse-products',
    component: ProductsBrowseComponent,
    canActivate: [ActivateProductsComponent]
  },
  {
    path: 'product/register',
    component: ProductFormComponent,
    canActivate: [ActivateProductsComponent, CanActivateRegisterProductFormComponent],
    canDeactivate: [CanDeactivateProductFormComponent]
  },
  {
    path: 'product/:id/edit',
    component: ProductFormComponent,
    canActivate: [ActivateProductsComponent, CanActivateUpdateProductFormComponent],
    canDeactivate: [CanDeactivateProductFormComponent]
  },
  {
    path: 'product/:id',
    component: ProductDetailsComponent,
    canActivate: [ActivateProductsComponent]
  },
  {
    path: 'product-elist/:id',
    component: ProductElistDetailsComponent,
    canActivate: [ActivateProductsComponent]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(productRoutes),
    MatToolbarModule,
    MatSidenavModule,
    MatCardModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSliderModule,
    MatDialogModule,
    MatListModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatTabsModule,
    MatBottomSheetModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    SubstanceSelectorModule,
    SubstanceSearchSelectorModule,
    SubstanceImageModule,
    SubstanceFormModule,
    FacetsManagerModule,
    ProductTextSearchModule
  ],
  declarations: [
    ProductsBrowseComponent,
    ProductDetailsBaseComponent,
    ProductDetailsComponent,
    ProductElistDetailsComponent,
    ProductFormComponent,
    ProductComponentFormComponent,
    ProductLotFormComponent,
    ProductIngredientFormComponent,
  ],
  exports: [
    ProductsBrowseComponent,
    ProductDetailsBaseComponent,
    ProductDetailsComponent,
    ProductElistDetailsComponent
  ],
  providers: [
    CanActivateRegisterProductFormComponent,
    CanActivateUpdateProductFormComponent,
    CanDeactivateProductFormComponent,
    ActivateProductsComponent
  ]
})

export class ProductModule {
  constructor(router: Router) {
    productRoutes.forEach(route => {
      router.config[0].children.push(route);
    });
  }

  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: ProductModule,
      providers: [
        ProductService,
        CanActivateRegisterProductFormComponent,
        CanActivateUpdateProductFormComponent,
        CanDeactivateProductFormComponent,
        ActivateProductsComponent
      ]
    };
  }

}
