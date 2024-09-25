import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceFormReferencesCardComponent } from './substance-form-references-card.component';
import { DynamicComponentLoaderModule } from '@gsrs-core/dynamic-component-loader';
import { SubstanceFormModule } from '../substance-form.module';
import { MatDividerModule } from '@angular/material/divider';
import { ScrollToModule } from '@gsrs-core/scroll-to';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import {ReferenceFormComponent} from "./reference-form.component";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RefernceFormDialogComponent } from './references-dialogs/refernce-form-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormReferencesCardComponent),
    SubstanceFormModule,
    MatDividerModule,
    ScrollToModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    MatInputModule,
    MatCheckboxModule,
    
  ],
  exports:[
    ReferenceFormComponent,
    RefernceFormDialogComponent,

  ],
  declarations: [
    SubstanceFormReferencesCardComponent,
    ReferenceFormComponent,
    RefernceFormDialogComponent
  ]
})
export class SubstanceFormReferencesModule { }
