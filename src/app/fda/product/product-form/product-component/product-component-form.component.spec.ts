import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComponentFormComponent } from './product-component-form.component';
import { ProductManufactureItem } from '../../model/product.model';
import { ProductService } from '../../service/product.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary/controlled-vocabulary.service';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProductComponentFormComponent', () => {
  let component: ProductComponentFormComponent;
  let fixture: ComponentFixture<ProductComponentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatIconModule ],
      declarations: [ ProductComponentFormComponent ],
      // NO_ERRORS_SCHEMA: this "should create" test isn't the place to also stand up
      // every child component (app-cv-input, mat-form-field, etc.) this large form uses;
      // that belongs to their own specs.
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ProductService, useValue: {} },
        { provide: ControlledVocabularyService, useValue: {} },
        { provide: AuthService, useValue: { getUser: () => null } },
        { provide: MatDialog, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponentFormComponent);
    component = fixture.componentInstance;
    // template dereferences productComponent immediately (e.g. productManufacturers.length)
    component.productComponent = { productManufacturers: [], productLots: [] } as ProductManufactureItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
