import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StructureDetailsComponent } from './structure-details.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import {MatIconModule, MatListModule} from '@angular/material';
import {ReferencesManagerModule} from '../../references-manager/references-manager.module';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import {SubstanceMolecularWeightDisplay } from '@gsrs-core/utils/substance-mw-display.pipe';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(StructureDetailsComponent),
    MatIconModule,
    ReferencesManagerModule,
    SubstanceImageModule,
    MatListModule,
    SubstanceMolecularWeightDisplay
  ],
  declarations: [
    StructureDetailsComponent,
    SubstanceMolecularWeightDisplay
  ]
})
export class StructureDetailsModule { }
