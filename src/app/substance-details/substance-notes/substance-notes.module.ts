import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceNotesComponent } from './substance-notes.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceNotesComponent)
  ],
  declarations: [SubstanceNotesComponent]
})
export class SubstanceNotesModule { }
