import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsBaseComponent } from './product-details-base.component';

describe('ProductDetailsBaseComponent', () => {
  let component: ProductDetailsBaseComponent;
  let fixture: ComponentFixture<ProductDetailsBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductDetailsBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
