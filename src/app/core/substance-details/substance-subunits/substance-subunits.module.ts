import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceSubunitsComponent } from './substance-subunits.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceSubunitsComponent),
    MatTooltipModule,
    MatButtonToggleModule,
    MatIconModule
  ],
  declarations: [SubstanceSubunitsComponent]
})
export class SubstanceSubunitsModule { }
