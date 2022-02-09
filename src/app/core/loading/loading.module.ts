import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    LoadingComponent,
    LoadingOverlayComponent
  ],
  exports: [
    LoadingComponent
  ],
  entryComponents: [
    LoadingOverlayComponent
  ]
})
export class LoadingModule { }
