import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceFormSimplifiedCodesCardComponent } from './substance-form-simplified-codes-card.component';
import { DynamicComponentLoaderModule } from '@gsrs-core/dynamic-component-loader';
import { SubstanceFormModule } from '../substance-form.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ScrollToModule } from '@gsrs-core/scroll-to';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { SimplifiedCodeFormComponent } from './simplified-code-form.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormSimplifiedCodesCardComponent),
    SubstanceFormModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    ScrollToModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    MatInputModule,
    MatTooltipModule
  ],
  declarations: [
    SubstanceFormSimplifiedCodesCardComponent,
    SimplifiedCodeFormComponent
  ]
})
export class SubstanceFormSimplifiedCodesModule { }
