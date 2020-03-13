import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceMoietiesComponent } from './substance-moieties.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceMoietiesComponent),
    SubstanceImageModule
  ],
  declarations: [SubstanceMoietiesComponent]
})
export class SubstanceMoietiesModule { }
