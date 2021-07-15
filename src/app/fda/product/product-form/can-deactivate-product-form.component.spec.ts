import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanDeactivateProductFormComponent } from './can-deactivate-product-form.component';

describe('CanDeactivateProductFormComponent', () => {
  let component: CanDeactivateProductFormComponent;
  let fixture: ComponentFixture<CanDeactivateProductFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanDeactivateProductFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanDeactivateProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
