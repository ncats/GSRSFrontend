import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { LoadingService } from './loading.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  imports: [
    CommonModule,
    MatProgressBarModule
  ],
  declarations: [
    LoadingComponent
  ],
  providers: [
    LoadingService
  ],
  exports: [
    LoadingComponent
  ]
})
export class LoadingModule { }
