import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import {ReferencesManagerComponent} from './references-manager.component';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule
  ],
  declarations: [ReferencesManagerComponent],
  exports: [ReferencesManagerComponent]
})
export class ReferencesManagerModule { }
