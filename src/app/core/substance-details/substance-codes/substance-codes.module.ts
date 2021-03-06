import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceCodesComponent } from './substance-codes.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTreeModule } from '@angular/material/tree';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import {ReferencesManagerModule} from '../../references-manager/references-manager.module';
import {MatDialogModule} from '@angular/material';
import {MatSortModule} from '@angular/material/sort';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceCodesComponent),
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatTreeModule,
    RouterModule,
    MatIconModule,
    ReferencesManagerModule,
    MatDialogModule,
    MatSortModule
  ],
  declarations: [
    SubstanceCodesComponent
  ]
})
export class SubstanceCodesModule { }
