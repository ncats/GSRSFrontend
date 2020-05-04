import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductService } from './service/product.service';
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
import { MatTabsModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { ProductDetailsBaseComponent } from './product-details/product-details-base.component';
import { ProductDetailsComponent } from './product-details/product-details/product-details.component';
import { ProductElistDetailsComponent } from './product-details/product-elist-details/product-elist-details.component';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductComponentFormComponent } from './product-form/product-component/product-component-form.component';
import { ProductLotFormComponent } from './product-form/product-lot-form/product-lot-form.component';
import { ProductIngredientFormComponent } from './product-form/product-ingredient-form/product-ingredient-form.component';
import { JsonDialogFdaComponent } from '../json-dialog-fda/json-dialog-fda.component';
import { SubstanceSearchSelectorModule } from '../substance-search-select/substance-search-selector.module';

const productRoutes: Routes = [
    {
    path: 'products/:id',
    component: ProductElistDetailsComponent
  },
  {
    path: 'productElistDetails/:id/:src',
    component: ProductElistDetailsComponent
  },
  {
    path: 'productDetails/:id/:src',
    component: ProductDetailsComponent
  },
  {
    path: 'product/register',
    component: ProductFormComponent
  },
  {
    path: 'product/:id/edit',
    component: ProductFormComponent
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
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    SubstanceImageModule,
    SubstanceSearchSelectorModule
  ],
  declarations: [
    ProductDetailsBaseComponent,
    ProductDetailsComponent,
    ProductElistDetailsComponent,
    ProductFormComponent,
    ProductComponentFormComponent,
    ProductLotFormComponent,
    ProductIngredientFormComponent,
 //   JsonDialogFdaComponent
  ],
  exports: [
    ProductDetailsBaseComponent,
    ProductDetailsComponent,
    ProductElistDetailsComponent,
 //   JsonDialogFdaComponent
  ]
})

export class ProductModule {
  constructor(router: Router) {
    productRoutes.forEach(route => {
      router.config[0].children.push(route);
    });
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ProductModule,
      providers: [
        ProductService
      ]
    };
  }

}
