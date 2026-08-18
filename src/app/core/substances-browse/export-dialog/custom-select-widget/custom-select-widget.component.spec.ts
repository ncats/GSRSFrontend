import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { NEVER } from 'rxjs';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { MatDialog } from '@angular/material/dialog';

import { CustomSelectWidgetComponent } from './custom-select-widget.component';

describe('CustomSelectWidgetComponent', () => {
  let component: CustomSelectWidgetComponent;
  let fixture: ComponentFixture<CustomSelectWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomSelectWidgetComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ControlledVocabularyService, useValue: {} },
        { provide: MatDialog, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSelectWidgetComponent);
    component = fixture.componentInstance;
    component.control = new UntypedFormControl();
    component.formProperty = { valueChanges: NEVER, errorsChanges: NEVER, setValue: () => null } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
