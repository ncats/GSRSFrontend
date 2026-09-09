import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ssg4mStagesFormComponent } from './ssg4m-stages-form.component';

@NgModule({
  imports: [
    CommonModule,
    Ssg4mStagesFormComponent
  ],
  exports: [
    Ssg4mStagesFormComponent
  ]
})

export class Ssg4mStagesModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: Ssg4mStagesModule,
      providers: [
      ]
    };
  }
}
