import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuidedSearchComponent } from './guided-search.component';
import { MatCardModule, MatInputModule, MatAutocompleteModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { QueryStatementComponent } from './query-statement/query-statement.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    MatTooltipModule
  ],
  exports: [
    GuidedSearchComponent
  ]
})
export class GuidedSearchModule { }
