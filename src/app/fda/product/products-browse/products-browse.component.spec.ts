import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsBrowseComponent } from './products-browse.component';

describe('ProductsBrowseComponent', () => {
  let component: ProductsBrowseComponent;
  let fixture: ComponentFixture<ProductsBrowseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsBrowseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
