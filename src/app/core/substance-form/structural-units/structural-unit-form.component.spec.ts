import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructuralUnitFormComponent } from './structural-unit-form.component';

describe('StructuralUnitFormComponent', () => {
  let component: StructuralUnitFormComponent;
  let fixture: ComponentFixture<StructuralUnitFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StructuralUnitFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructuralUnitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
