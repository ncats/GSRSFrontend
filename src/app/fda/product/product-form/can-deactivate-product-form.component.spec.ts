import { TestBed, inject } from '@angular/core/testing';
import { ProductService } from '../service/product.service';

import { CanDeactivateProductFormComponent } from './can-deactivate-product-form.component';

describe('CanDeactivateProductFormComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CanDeactivateProductFormComponent,
        { provide: ProductService, useValue: {} }
      ]
    });
  });

  it('should create', inject([CanDeactivateProductFormComponent], (guard: CanDeactivateProductFormComponent) => {
    expect(guard).toBeTruthy();
  }));
});
