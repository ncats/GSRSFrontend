import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceNamesComponent } from './substance-names.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {ReferencesManagerModule} from '../../references-manager/references-manager.module';
import {MatDialogModule, MatIconModule, MatSortModule, MatTooltipModule} from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceNamesComponent),
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
    MatTooltipModule
  ],
  declarations: [SubstanceNamesComponent,
  ]
})
export class SubstanceNamesModule { }
