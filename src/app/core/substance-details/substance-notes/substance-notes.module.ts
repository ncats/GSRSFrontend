import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceNotesComponent } from './substance-notes.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {ReferencesManagerModule} from '../../references-manager/references-manager.module';
import {ReadMoreComponent} from '@gsrs-core/substance-details/substance-notes/read-more/read-more.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceNotesComponent),
    MatTableModule,
    CdkTableModule,
    MatDialogModule,
    ReferencesManagerModule,
    MatIconModule
  ],
  declarations: [SubstanceNotesComponent, ReadMoreComponent]
})
export class SubstanceNotesModule { }
