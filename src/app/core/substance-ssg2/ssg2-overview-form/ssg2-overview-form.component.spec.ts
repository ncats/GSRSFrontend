import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Ssg2OverviewFormComponent } from './ssg2-overview-form.component';

@Component({ selector: 'app-cv-input', template: '', standalone: true })
class CvInputStubComponent {
  @Input() domain: any;
  @Input() title: any;
  @Input() model: any;
  @Output() valueChange = new EventEmitter<any>();
}

describe('Ssg2OverviewFormComponent', () => {
  let component: Ssg2OverviewFormComponent;
  let fixture: ComponentFixture<Ssg2OverviewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ Ssg2OverviewFormComponent ],
      providers: [
        { provide: SubstanceFormService, useValue: { substance: of({ specifiedSubstanceG2: { substanceRole: '', grade: '', comments: '' } }), resetState: () => null } },
        { provide: GoogleAnalyticsService, useValue: { sendEvent: () => null } },
        { provide: ControlledVocabularyService, useValue: {} }
      ]
    })
    .overrideComponent(Ssg2OverviewFormComponent, {
      set: {
        imports: [FormsModule, MatFormFieldModule, MatInputModule, CvInputStubComponent]
      }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ssg2OverviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
