import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DynamicComponentLoaderModule} from "@gsrs-core/dynamic-component-loader";
import {SubstanceFormModule} from "@gsrs-core/substance-form/substance-form.module";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {ScrollToModule} from "@gsrs-core/scroll-to";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatInputModule} from "@angular/material/input";
import {SubstanceFormStructuralUnitsComponent} from "@gsrs-core/substance-form/substance-form-structural-units/substance-form-structural-units.component";

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormStructuralUnitsComponent),
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
    SubstanceFormStructuralUnitsComponent
  ]
})
export class SubstanceFormStructuralUnitsModule { }
