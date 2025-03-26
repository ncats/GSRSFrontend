import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StructureDetailsComponent } from './structure-details.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import {ReferencesManagerModule} from '../../references-manager/references-manager.module';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(StructureDetailsComponent),
    MatIconModule,
    ReferencesManagerModule,
    SubstanceImageModule,
    MatListModule,
    MatTooltipModule
  ],
  declarations: [
    StructureDetailsComponent
  ]
})
export class StructureDetailsModule { }
