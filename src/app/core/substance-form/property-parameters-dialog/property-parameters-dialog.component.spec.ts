import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyParametersDialogComponent } from './property-parameters-dialog.component';

describe('PropertyParametersDialogComponent', () => {
  let component: PropertyParametersDialogComponent;
  let fixture: ComponentFixture<PropertyParametersDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyParametersDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyParametersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
