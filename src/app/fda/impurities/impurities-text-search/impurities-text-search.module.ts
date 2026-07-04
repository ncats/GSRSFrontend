import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { ImpuritiesTextSearchComponent } from './impurities-text-search.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  declarations: [
    ImpuritiesTextSearchComponent
  ],
  exports: [
    ImpuritiesTextSearchComponent
  ]
})

export class ImpuritiesTextSearchModule { }
