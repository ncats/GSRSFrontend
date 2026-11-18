import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';

@NgModule({
  imports: [
    CommonModule,
    LoadingComponent,
    LoadingOverlayComponent
  ],
  exports: [
    LoadingComponent
  ]
})
export class LoadingModule { }
