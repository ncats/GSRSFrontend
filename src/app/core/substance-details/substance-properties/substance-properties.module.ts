import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DynamicComponentLoaderModule} from '../../dynamic-component-loader/dynamic-component-loader.module';
import {SubstancePropertiesComponent} from './substance-properties.component';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CdkTableModule} from '@angular/cdk/table';
import { MatIconModule } from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { ReferencesManagerModule } from '@gsrs-core/references-manager';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstancePropertiesComponent),
    MatTableModule,
    MatIconModule,
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
