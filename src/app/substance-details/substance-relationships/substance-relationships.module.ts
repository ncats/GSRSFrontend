import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceRelationshipsComponent } from './substance-relationships.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { MatTableModule } from '@angular/material/table';
import {ReferencesManagerModule} from '../../references-manager/references-manager.module';
import {MatIconModule, MatDialogModule, MatPaginatorModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CdkTableModule} from '@angular/cdk/table';
import {RouterModule} from '@angular/router';

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
    RouterModule
  ],
  declarations: [SubstanceRelationshipsComponent]
})
export class SubstanceRelationshipsModule { }
