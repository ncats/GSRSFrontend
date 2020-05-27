import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuidedSearchComponent } from './guided-search.component';
import {
  MatCardModule,
  MatInputModule,
  MatAutocompleteModule,
  MatSelectModule,
  MatTooltipModule,
  MatButtonModule,
  MatIconModule
} from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { QueryStatementComponent } from './query-statement/query-statement.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    GuidedSearchComponent,
    QueryStatementComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatAutocompleteModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    RouterModule
  ],
  exports: [
    GuidedSearchComponent
  ]
})
export class GuidedSearchModule { }
