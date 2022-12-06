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
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import {MatTooltipModule} from '@angular/material/tooltip';
import { TableModule } from 'primeng/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { ElementLabelDisplayModule } from '@gsrs-core/utils/element-label-display.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceNamesComponent),
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    ReferencesManagerModule,
    MatIconModule,
    MatDialogModule,
    MatSortModule,
    TableModule,
    MatTooltipModule,
    MatRadioModule,
    ElementLabelDisplayModule
  ],
  declarations: [SubstanceNamesComponent,
  ]
})
export class SubstanceNamesModule { }
