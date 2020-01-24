import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceMixtureComponentsComponent } from './substance-mixture-components.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DynamicComponentLoaderModule.forChild(SubstanceMixtureComponentsComponent),
  ],
  declarations: [
    SubstanceMixtureComponentsComponent
  ]
})
export class SubstanceMixtureComponentsModule { }

