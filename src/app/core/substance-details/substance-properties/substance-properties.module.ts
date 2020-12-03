import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DynamicComponentLoaderModule} from '../../dynamic-component-loader/dynamic-component-loader.module';
import {SubstancePropertiesComponent} from './substance-properties.component';
import {MatInputModule, MatPaginatorModule, MatTableModule, MatDialogModule, MatTooltipModule} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';
import {RouterModule} from '@angular/router';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { ReferencesManagerModule } from '@gsrs-core/references-manager';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstancePropertiesComponent),
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatInputModule,
    RouterModule,
    SubstanceImageModule,
    ReferencesManagerModule,
    MatDialogModule,
    MatTooltipModule
  ],
  declarations: [SubstancePropertiesComponent]
})
export class SubstancePropertiesModule {
}
