import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstancePolymerStructureComponent } from './substance-polymer-structure.component';
import {RouterLinkDirectiveMock} from "../../../../testing/router-link-mock.directive";

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstancePolymerStructureComponent)
  ],
    declarations: [SubstancePolymerStructureComponent, RouterLinkDirectiveMock]
})
export class SubstancePolymerStructureModule { }
