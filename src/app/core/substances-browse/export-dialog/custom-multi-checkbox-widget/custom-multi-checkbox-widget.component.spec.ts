import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { NEVER } from 'rxjs';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { MatDialog } from '@angular/material/dialog';

import { CustomMultiCheckboxWidgetComponent } from './custom-multi-checkbox-widget.component';

describe('CustomMultiCheckboxWidgetComponent', () => {
  let component: CustomMultiCheckboxWidgetComponent;
  let fixture: ComponentFixture<CustomMultiCheckboxWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomMultiCheckboxWidgetComponent ],
      imports: [ ReactiveFormsModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ControlledVocabularyService, useValue: {} },
        { provide: MatDialog, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomMultiCheckboxWidgetComponent);
    component = fixture.componentInstance;
    component.control = new UntypedFormControl();
    component.formProperty = { valueChanges: NEVER, errorsChanges: NEVER, setValue: () => null } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
