import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import {SubstanceConstituentsComponent} from '@gsrs-core/substance-details/substance-constituents/substance-constituents.component';
import {MatTableModule} from '@angular/material/table';
import {ReferencesManagerModule} from '@gsrs-core/references-manager';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CdkTableModule} from '@angular/cdk/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DynamicComponentLoaderModule.forChild(SubstanceConstituentsComponent),
    MatTableModule,
    ReferencesManagerModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    CdkTableModule,
    MatTooltipModule,
    RouterModule,
    MatSortModule,
    SubstanceImageModule
  ],
  declarations: [
    SubstanceConstituentsComponent
  ]
})
export class SubstanceConstituentsModule { }
