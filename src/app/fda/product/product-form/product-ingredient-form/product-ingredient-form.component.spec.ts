import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductIngredientFormComponent } from './product-ingredient-form.component';

describe('ProductIngredientFormComponent', () => {
  let component: ProductIngredientFormComponent;
  let fixture: ComponentFixture<ProductIngredientFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductIngredientFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductIngredientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
