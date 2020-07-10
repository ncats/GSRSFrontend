import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, Routes, RouterModule } from '@angular/router';
import { SubstanceApplicationMatchListComponent } from './substance-application-match-list.component';
import { MatTableModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [SubstanceApplicationMatchListComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatCardModule
  ]
})
export class SubstanceApplicationMatchListModule { }
