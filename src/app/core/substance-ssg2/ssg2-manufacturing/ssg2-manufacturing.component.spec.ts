import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceFormSsg2ManufacturingService } from './substance-form-ssg2-manufacturing.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Ssg2ManufacturingComponent } from './ssg2-manufacturing.component';

@Component({ selector: 'app-cv-input', template: '', standalone: true })
class CvInputStubComponent {
  @Input() domain: any;
  @Input() title: any;
  @Input() model: any;
  @Output() valueChange = new EventEmitter<any>();
}

describe('Ssg2ManufacturingComponent', () => {
  let component: Ssg2ManufacturingComponent;
  let fixture: ComponentFixture<Ssg2ManufacturingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ Ssg2ManufacturingComponent ],
      providers: [
        { provide: SubstanceFormService, useValue: { substance: NEVER } },
        { provide: SubstanceFormSsg2ManufacturingService, useValue: {} },
        { provide: GoogleAnalyticsService, useValue: { sendEvent: () => null } },
        { provide: ControlledVocabularyService, useValue: {} }
      ]
    })
    .overrideComponent(Ssg2ManufacturingComponent, {
      set: {
        imports: [FormsModule, MatIconModule, MatButtonModule, MatTooltipModule, MatFormFieldModule, MatInputModule, CvInputStubComponent]
      }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ssg2ManufacturingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
