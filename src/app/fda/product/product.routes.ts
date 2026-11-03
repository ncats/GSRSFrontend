import { Routes } from "@angular/router";
import { ProductsBrowseComponent } from "./products-browse/products-browse.component";
import { ActivateProductsComponent } from "./activate-products.component";
import { ProductFormComponent } from "./product-form/product-form.component";
import { CanActivateRegisterProductFormComponent } from "./product-form/can-activate-register-product-form.component";
import { CanDeactivateProductFormComponent } from "./product-form/can-deactivate-product-form.component";
import { CanActivateUpdateProductFormComponent } from "./product-form/can-activate-update-product-form.component";
import { ProductDetailsComponent } from "./product-details/product-details/product-details.component";
import { ProductElistDetailsComponent } from "./product-details/product-elist-details/product-elist-details.component";

export const PRODUCT_ROUTES: Routes = [
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
]