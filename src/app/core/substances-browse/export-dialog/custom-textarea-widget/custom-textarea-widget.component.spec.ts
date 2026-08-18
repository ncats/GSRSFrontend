import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { NEVER } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { CustomTextareaWidgetComponent } from './custom-textarea-widget.component';

describe('CustomTextareaWidgetComponent', () => {
  let component: CustomTextareaWidgetComponent;
  let fixture: ComponentFixture<CustomTextareaWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomTextareaWidgetComponent ],
      imports: [ ReactiveFormsModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: MatDialog, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTextareaWidgetComponent);
    component = fixture.componentInstance;
    component.control = new UntypedFormControl();
    component.formProperty = { valueChanges: NEVER, errorsChanges: NEVER, setValue: () => null } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
