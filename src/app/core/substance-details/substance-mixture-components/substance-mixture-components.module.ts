import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceMixtureComponentsComponent } from './substance-mixture-components.component';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatIconModule,
    DynamicComponentLoaderModule.forChild(SubstanceMixtureComponentsComponent),
    SubstanceImageModule
  ],
  declarations: [
    SubstanceMixtureComponentsComponent
  ]
})
export class SubstanceMixtureComponentsModule { }

