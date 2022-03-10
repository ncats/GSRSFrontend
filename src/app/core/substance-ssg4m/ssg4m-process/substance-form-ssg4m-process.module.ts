import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SubstanceFormNotesCardComponent } from './substance-form-notes-card.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceFormModule } from '../../substance-form/substance-form.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ScrollToModule } from '../../scroll-to/scroll-to.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { Ssg4mProcessFormComponent } from './ssg4m-process-form.component';
import { SubstanceFormSsg4mProcessCardComponent } from './substance-form-ssg4m-process-card.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormSsg4mProcessCardComponent),
    SubstanceFormModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    ScrollToModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    MatInputModule
  ],
  declarations: [
  //  SubstanceFormNotesCardComponent,
    Ssg4mProcessFormComponent,
  SubstanceFormSsg4mProcessCardComponent
  ]
})
export class SubstanceSsg4mProcessModule { }

