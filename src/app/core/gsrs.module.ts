import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class GsrsModule {
  static forRoot(): ModuleWithProviders<GsrsModule> {
    return {
      ngModule: GsrsModule
    };
  }
}
