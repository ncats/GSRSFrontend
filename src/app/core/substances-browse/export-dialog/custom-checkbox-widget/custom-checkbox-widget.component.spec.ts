import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { NEVER } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { CustomCheckboxWidgetComponent } from './custom-checkbox-widget.component';

describe('CustomCheckboxWidgetComponent', () => {
  let component: CustomCheckboxWidgetComponent;
  let fixture: ComponentFixture<CustomCheckboxWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomCheckboxWidgetComponent ],
      imports: [ ReactiveFormsModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: MatDialog, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCheckboxWidgetComponent);
    component = fixture.componentInstance;
    component.control = new UntypedFormControl();
    component.formProperty = { valueChanges: NEVER, errorsChanges: NEVER, setValue: () => null } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
