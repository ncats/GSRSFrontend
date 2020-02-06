import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyParameterDialogComponent } from './property-parameter-dialog.component';

describe('PropertyParameterDialogComponent', () => {
  let component: PropertyParameterDialogComponent;
  let fixture: ComponentFixture<PropertyParameterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyParameterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyParameterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
