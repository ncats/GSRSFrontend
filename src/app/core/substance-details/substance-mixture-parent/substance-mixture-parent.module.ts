import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DynamicComponentLoaderModule } from '@gsrs-core/dynamic-component-loader';
import { SubstanceMixtureParentComponent } from '@gsrs-core/substance-details/substance-mixture-parent/substance-mixture-parent.component';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';



@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DynamicComponentLoaderModule.forChild(SubstanceMixtureParentComponent),
    SubstanceImageModule
  ],
  declarations: [
    SubstanceMixtureParentComponent
  ]
})
export class SubstanceMixtureParentModule { }
