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
import {MatDialogModule} from '@angular/material/dialog';
import {MatSortModule} from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CodeDisplayModule } from '@gsrs-core/utils/code-display.module';
import { forwardSlash } from './codeSearchPipe';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceCodesComponent),
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatTreeModule,
    RouterModule,
    MatIconModule,
    ReferencesManagerModule,
    MatDialogModule,
    MatSortModule,
    CodeDisplayModule
  ],
  declarations: [
    SubstanceCodesComponent,
    forwardSlash
  ],
  providers: [forwardSlash]
})
export class SubstanceCodesModule { }
