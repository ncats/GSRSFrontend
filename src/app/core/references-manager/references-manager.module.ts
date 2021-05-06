import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule, MatIconModule, MatTooltipModule} from '@angular/material';
import {ReferencesManagerComponent} from './references-manager.component';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule
  ],

  declarations: [ReferencesManagerComponent],
  exports: [ReferencesManagerComponent],
})
export class ReferencesManagerModule { }
