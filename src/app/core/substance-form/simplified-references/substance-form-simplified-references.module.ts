import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceFormSimplifiedReferencesCardComponent } from './substance-form-simplified-references-card.component';
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
import {MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormSimplifiedReferencesCardComponent),
    MatDividerModule,
    ScrollToModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    MatInputModule,
    SubstanceFormModule,
    MatTooltipModule
  ],
  declarations: [
    SubstanceFormSimplifiedReferencesCardComponent,
    ReferenceFormComponent
  ]
})
export class SubstanceFormSimplifiedReferencesModule { }
