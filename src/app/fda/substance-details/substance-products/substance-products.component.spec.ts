import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceProductsComponent } from './substance-products.component';

describe('ProductComponent', () => {
  let component: SubstanceProductsComponent;
  let fixture: ComponentFixture<SubstanceProductsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
