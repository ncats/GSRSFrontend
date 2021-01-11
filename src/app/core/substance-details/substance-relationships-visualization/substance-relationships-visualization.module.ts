import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceRelationshipsVisualizationComponent } from './substance-relationships-visualization.component';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceRelationshipsVisualizationComponent),
    MatButtonModule,
  ],
  declarations: [SubstanceRelationshipsVisualizationComponent]
})
export class SubstanceRelationshipsVisualizationModule {}
