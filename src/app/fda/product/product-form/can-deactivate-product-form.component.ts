import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../service/product.service';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateProductFormComponent implements CanDeactivate<ProductFormComponent> {
  constructor(
    private productService: ProductService
  ) {}
  canDeactivate(component: ProductFormComponent): boolean {
    if (this.productService.isProductUpdated) {
      if (confirm('You have unsaved changes! If you leave, your changes will be lost.')) {
          return true;
      } else {
          return false;
      }
    }
    return true;
  }
}
