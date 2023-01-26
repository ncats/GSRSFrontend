import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceRelationshipsComponent } from './substance-relationships.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { MatTableModule } from '@angular/material/table';
import {ReferencesManagerModule} from '../../references-manager/references-manager.module';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CdkTableModule} from '@angular/cdk/table';
import {RouterModule} from '@angular/router';
import {MatSortModule} from '@angular/material/sort';
import {MatTooltipModule} from '@angular/material/tooltip';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { RelationshipsDownloadButtonComponent } from '@gsrs-core/substance-form/relationships/relationships-download-button/relationships-download-button.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceRelationshipsComponent),
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
    SubstanceRelationshipsComponent,
    RelationshipsDownloadButtonComponent
  ],
  exports: [
    RelationshipsDownloadButtonComponent    
  ]
})
export class SubstanceRelationshipsModule { }
