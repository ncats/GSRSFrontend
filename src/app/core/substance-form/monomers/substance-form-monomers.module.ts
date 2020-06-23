import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceFormMonomersCardComponent } from './substance-form-monomers-card.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceFormModule } from '../substance-form.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ScrollToModule } from '../../scroll-to/scroll-to.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MonomerFormComponent } from './monomer-form.component';
import { SubstanceSelectorModule } from '@gsrs-core/substance-selector/substance-selector.module';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormMonomersCardComponent),
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
    SubstanceSelectorModule,
    MatCheckboxModule
  ],
  declarations: [
    SubstanceFormMonomersCardComponent,
    MonomerFormComponent
  ]
})
export class SubstanceFormMonomersModule { }
