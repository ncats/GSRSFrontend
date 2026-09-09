import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NEVER, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceFormPropertiesService } from '@gsrs-core/substance-form/properties/substance-form-properties.service';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { ConfigService } from '@gsrs-core/config';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';

import { Ssg4mCriticalParameterFormComponent } from './ssg4m-critical-parameter-form.component';

@Component({ selector: 'app-cv-input', template: '', standalone: true })
class CvInputStubComponent {
  @Input() domain: any;
  @Input() title: any;
  @Input() model: any;
  @Output() valueChange = new EventEmitter<any>();
}

@Component({ selector: 'app-substance-selector', template: '', standalone: true })
class SubstanceSelectorStubComponent {
  @Input() eventCategory: any;
  @Input() placeholder: any;
  @Input() header: any;
  @Input() subuuid: any;
  @Input() showMorelinks: any;
  @Output() selectionUpdated = new EventEmitter<any>();
}

describe('Ssg4mCriticalParameterComponent', () => {
  let component: Ssg4mCriticalParameterFormComponent;
  let fixture: ComponentFixture<Ssg4mCriticalParameterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ Ssg4mCriticalParameterFormComponent ],
      providers: [
        { provide: SubstanceFormService, useValue: { substance: of({
          specifiedSubstanceG4m: { process: [{ sites: [{ stages: [{ criticalParameters: [{}] }] }] }] }
        }) } },
        { provide: SubstanceFormPropertiesService, useValue: {} },
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => NEVER } },
        { provide: ConfigService, useValue: { configData: {} } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => NEVER }) } }
      ]
    })
    .overrideComponent(Ssg4mCriticalParameterFormComponent, {
      set: {
        imports: [
          ReactiveFormsModule,
          MatIconModule,
          MatButtonModule,
          MatTooltipModule,
          MatFormFieldModule,
          MatInputModule,
          MatSelectModule,
          MatOptionModule,
          MatListModule,
          CvInputStubComponent,
          SubstanceSelectorStubComponent
        ]
      }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ssg4mCriticalParameterFormComponent);
    component = fixture.componentInstance;
    component.processIndex = 0;
    component.siteIndex = 0;
    component.stageIndex = 0;
    component.criticalParameterIndex = 0;
    component.criticalParameter = { value: {} } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
