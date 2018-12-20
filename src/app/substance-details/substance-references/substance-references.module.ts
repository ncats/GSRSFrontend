import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceReferencesComponent } from './substance-references.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceReferencesComponent)
  ],
  declarations: [SubstanceReferencesComponent]
})
export class SubstanceReferencesModule { }
