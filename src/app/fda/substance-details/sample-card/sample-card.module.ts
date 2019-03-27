import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentLoaderModule } from '../../../core/dynamic-component-loader/dynamic-component-loader.module';
import { SampleCardComponent } from './sample-card.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SampleCardComponent)
  ],
  declarations: [SampleCardComponent]
})
export class SampleCardModule { }
