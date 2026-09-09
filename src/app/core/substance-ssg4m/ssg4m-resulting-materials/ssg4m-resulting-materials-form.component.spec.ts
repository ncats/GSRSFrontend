import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NEVER, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceFormSsg4mStagesService } from '../ssg4m-stages/substance-form-ssg4m-stages.service';
import { UtilsService } from '@gsrs-core/utils';
import { ConfigService } from '@gsrs-core/config';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Ssg4mResultingMaterialsFormComponent } from './ssg4m-resulting-materials-form.component';

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
  @Input() showDraftOption: any;
  @Output() selectionUpdated = new EventEmitter<any>();
  @Output() draftSelected = new EventEmitter<any>();
}

describe('Ssg4mResultingMaterialsFormComponent', () => {
  let component: Ssg4mResultingMaterialsFormComponent;
  let fixture: ComponentFixture<Ssg4mResultingMaterialsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ Ssg4mResultingMaterialsFormComponent ],
      providers: [
        { provide: SubstanceFormService, useValue: { substance: of({
          specifiedSubstanceG4m: { process: [{ sites: [{ stages: [{ resultingMaterials: [{}] }] }] }] }
        }) } },
        { provide: SubstanceFormSsg4mStagesService, useValue: {} },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: UtilsService, useValue: {} },
        { provide: ConfigService, useValue: { configData: {} } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => NEVER }) } }
      ]
    })
    .overrideComponent(Ssg4mResultingMaterialsFormComponent, {
      set: {
        imports: [FormsModule, MatIconModule, MatButtonModule, MatTooltipModule, MatFormFieldModule, MatInputModule, CvInputStubComponent, SubstanceSelectorStubComponent]
      }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ssg4mResultingMaterialsFormComponent);
    component = fixture.componentInstance;
    component.processIndex = 0;
    component.siteIndex = 0;
    component.stageIndex = 0;
    component.resultingMaterialIndex = 0;
    component.resultingMaterial = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
