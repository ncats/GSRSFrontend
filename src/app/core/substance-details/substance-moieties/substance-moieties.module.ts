import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceMoietiesComponent } from './substance-moieties.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceMoietiesComponent)
  ],
  declarations: [SubstanceMoietiesComponent]
})
export class SubstanceMoietiesModule { }
