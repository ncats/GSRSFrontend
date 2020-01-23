import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyParameterFormComponent } from './property-parameter-form.component';

describe('PropertyParameterFormComponent', () => {
  let component: PropertyParameterFormComponent;
  let fixture: ComponentFixture<PropertyParameterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyParameterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyParameterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
