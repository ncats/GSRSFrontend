import { NgModule } from '@angular/core';
import { FacetsManagerComponent } from './facets-manager.component';
import { FacetDisplayPipe } from './facet-display.pipe';
import { FacetFilterPipe } from './facet-filter.pipe';

@NgModule({
  imports: [
    FacetsManagerComponent,
    FacetDisplayPipe,
    FacetFilterPipe
  ],
  exports: [
    FacetsManagerComponent,
    FacetDisplayPipe,
    FacetFilterPipe
  ]
})
export class FacetsManagerModule { }
