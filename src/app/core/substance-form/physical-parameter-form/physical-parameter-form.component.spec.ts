import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalParameterFormComponent } from './physical-parameter-form.component';

describe('PhysicalParameterFormComponent', () => {
  let component: PhysicalParameterFormComponent;
  let fixture: ComponentFixture<PhysicalParameterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalParameterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalParameterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
