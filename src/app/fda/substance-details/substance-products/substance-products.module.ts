import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentLoaderModule } from '@gsrs-core/dynamic-component-loader';
import { SubstanceProductsComponent } from './substance-products.component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SubstanceApplicationComponent } from './substance-application/substance-application.component';
import { SubstanceClinicalTrialsComponent } from './substance-clinical-trials/substance-clinical-trials.component';
@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceProductsComponent),
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  declarations: [
    SubstanceProductsComponent,
    SubstanceApplicationComponent,
    SubstanceClinicalTrialsComponent
  ]
})
export class SubstanceProductsModule { }
