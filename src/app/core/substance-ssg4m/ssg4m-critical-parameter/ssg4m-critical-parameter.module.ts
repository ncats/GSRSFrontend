import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { SubstanceFormModule } from '../../substance-form/substance-form.module';
import { SubstanceSelectorModule } from '@gsrs-core/substance-selector/substance-selector.module';
import { Ssg4mCriticalParameterFormComponent } from '../ssg4m-critical-parameter/ssg4m-critical-parameter-form.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    SubstanceFormModule,
    MatSelectModule,
    SubstanceSelectorModule,
    CommonModule
  ],
  declarations: [
    Ssg4mCriticalParameterFormComponent
  ],
  exports: [
    Ssg4mCriticalParameterFormComponent
  ]
})
export class Ssg4mCriticalParameterModule { }
