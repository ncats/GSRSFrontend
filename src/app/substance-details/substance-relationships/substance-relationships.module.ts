import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceRelationshipsComponent } from './substance-relationships.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { MatTableModule } from '@angular/material/table';
import {ReferencesManagerModule} from '../../references-manager/references-manager.module';
import {MatIconModule, MatDialogModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceRelationshipsComponent),
    MatTableModule,
    ReferencesManagerModule,
    MatIconModule,
    MatDialogModule
  ],
  declarations: [SubstanceRelationshipsComponent]
})
export class SubstanceRelationshipsModule { }
