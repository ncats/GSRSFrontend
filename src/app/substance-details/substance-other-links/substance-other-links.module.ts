import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceOtherLinksComponent } from './substance-other-links.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import {RouterModule} from '@angular/router';

@NgModule({
imports: [
  CommonModule,
  DynamicComponentLoaderModule.forChild(SubstanceOtherLinksComponent),
  RouterModule
],
  declarations: [SubstanceOtherLinksComponent]
})
export class SubstanceOtherLinksModule { }
