import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainNotificationComponent } from './main-notification/main-notification.component';

@NgModule({
  imports: [
    CommonModule,
    MainNotificationComponent
  ],
  exports: [
    MainNotificationComponent
  ]
})
export class MainNotificationModule { }
