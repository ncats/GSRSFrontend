
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { MatInputModule, MatPaginatorModule, MatTableModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {SubstanceStructuralUnitsComponent} from '@gsrs-core/substance-details/substance-structural-units/substance-structural-units.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceStructuralUnitsComponent),
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  declarations: [SubstanceStructuralUnitsComponent]
})
export class SubstanceStructuralUnitsModule { }
