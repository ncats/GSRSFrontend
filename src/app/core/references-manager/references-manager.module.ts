import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';

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
