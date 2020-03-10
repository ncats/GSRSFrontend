import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceConceptDefinitionComponent } from './substance-concept-definition.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { RouterModule } from '@angular/router';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceConceptDefinitionComponent),
    RouterModule,
    SubstanceImageModule
  ],
  declarations: [SubstanceConceptDefinitionComponent]
})
export class SubstanceConceptDefinitionModule { }
