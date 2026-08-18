import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NEVER } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { MatDialog } from '@angular/material/dialog';

import { CustomRadioWidgetComponent } from './custom-radio-widget.component';

describe('CustomRadioWidgetComponent', () => {
  let component: CustomRadioWidgetComponent;
  let fixture: ComponentFixture<CustomRadioWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomRadioWidgetComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ControlledVocabularyService, useValue: {} },
        { provide: MatDialog, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomRadioWidgetComponent);
    component = fixture.componentInstance;
    component.control = new UntypedFormControl();
    component.formProperty = { valueChanges: NEVER, errorsChanges: NEVER, setValue: () => null } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
