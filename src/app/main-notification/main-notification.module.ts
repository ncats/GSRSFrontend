import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainNotificationService } from './main-notification.service';
import { MainNotificationComponent } from './main-notification/main-notification.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MainNotificationComponent
  ],
  providers: [
    MainNotificationService
  ],
  exports: [
    MainNotificationComponent
  ]
})
export class MainNotificationModule { }
