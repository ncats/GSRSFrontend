import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTextSearchComponent } from './product-text-search.component';

describe('ProductTextSearchComponent', () => {
  let component: ProductTextSearchComponent;
  let fixture: ComponentFixture<ProductTextSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductTextSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTextSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
