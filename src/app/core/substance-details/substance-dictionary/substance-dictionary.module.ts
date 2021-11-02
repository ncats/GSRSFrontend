import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceDictionaryComponent } from './substance-dictionary.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {ReferencesManagerModule} from '../../references-manager/references-manager.module';
import {MatDialogModule, MatIconModule, MatSortModule, MatTooltipModule, MatChipsModule, MatMenuModule, MatCardModule} from '@angular/material';
import { RouterModule } from '@angular/router';
import { SequenceAlignmentComponent } from '@gsrs-core/substances-browse/sequence-alignment/sequence-alignment.component';
import { SubstanceHierarchyComponent } from '@gsrs-core/substances-browse/substance-hierarchy/substance-hierarchy.component';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { SubstanceClassModule}  from '@gsrs-core/utils/substance-class.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceDictionaryComponent),
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
    MatTooltipModule,
    MatChipsModule,
    RouterModule,
    MatMenuModule,
    MatCardModule,
    SubstanceImageModule,
    SubstanceClassModule
  ],
  declarations: [SubstanceDictionaryComponent, SubstanceClassModule ]
})
export class SubstanceDictionaryModule { }
