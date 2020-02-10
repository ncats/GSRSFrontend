import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductElistDetailsComponent } from './product-elist-details.component';

describe('ProductDetailsComponent', () => {
  let component: ProductElistDetailsComponent;
  let fixture: ComponentFixture<ProductElistDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductElistDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductElistDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
