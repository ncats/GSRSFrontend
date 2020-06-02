import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductManufactureFormComponent } from './product-manufacture-form.component';

describe('ProductManufactureFormComponent', () => {
  let component: ProductManufactureFormComponent;
  let fixture: ComponentFixture<ProductManufactureFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductManufactureFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductManufactureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
