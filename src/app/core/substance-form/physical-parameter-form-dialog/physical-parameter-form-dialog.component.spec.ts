import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalParameterFormDialogComponent } from './physical-parameter-form-dialog.component';

describe('PhysicalParameterFormDialogComponent', () => {
  let component: PhysicalParameterFormDialogComponent;
  let fixture: ComponentFixture<PhysicalParameterFormDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalParameterFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalParameterFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
