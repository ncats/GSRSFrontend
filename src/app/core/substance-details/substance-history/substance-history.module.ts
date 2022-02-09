import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SubstanceHistoryComponent} from '@gsrs-core/substance-details/substance-history/substance-history.component';
import {DynamicComponentLoaderModule} from '@gsrs-core/dynamic-component-loader/dynamic-component-loader.module';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import {MatTreeModule} from '@angular/material/tree';
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
