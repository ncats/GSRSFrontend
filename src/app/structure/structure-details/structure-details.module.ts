import { NgModule } from '@angular/core';
import { StructureDetailsComponent } from './structure-details.component';
import {
  DynamicComponentLoaderModule,
  DynamicComponentManifest
} from '../../dynamic-component-loader/dynamic-component-loader.module';
import { DYNAMIC_COMPONENT } from '../../dynamic-component-loader/dynamic-component-manifest';

const manifests: DynamicComponentManifest[] = [
  {
    componentId: 'structure-details',
    path: 'structure-details',
    loadChildren: './structure-details.module#StructureDetailsModule',
  },
];

@NgModule({
  imports: [
    DynamicComponentLoaderModule.forRoot(manifests)
  ],
  declarations: [
    StructureDetailsComponent
  ],
  providers: [
    { provide: DYNAMIC_COMPONENT, useValue: StructureDetailsComponent },
  ],
  entryComponents: [
    StructureDetailsComponent
  ]
})
export class StructureDetailsModule { }
