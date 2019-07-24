import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SubstanceHistoryComponent} from '@gsrs-core/substance-details/substance-history/substance-history.component';
import {DynamicComponentLoaderModule} from '@gsrs-core/dynamic-component-loader/dynamic-component-loader.module';
import {
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatTreeModule
} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ReferencesManagerModule} from '@gsrs-core/references-manager/references-manager.module';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceHistoryComponent),
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    ReferencesManagerModule,
    MatIconModule,
    MatDialogModule,
    MatSortModule,
    MatTreeModule,
    RouterModule,
    MatIconModule,
  ],
  declarations: [SubstanceHistoryComponent]
})
export class SubstanceHistoryModule { }
