import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceFormNamesCardComponent } from './substance-form-names-card.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceFormModule } from '../substance-form.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ScrollToModule } from '../../scroll-to/scroll-to.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { NameFormComponent } from './name-form.component';
import { NameOrgsComponent } from './name-orgs.component';

import { MatRadioModule, MatCheckboxModule, MatBadgeModule, MatExpansionModule, MatTableModule, MatSelectModule, MatTooltipModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormNamesCardComponent),
    SubstanceFormModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    ScrollToModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatTableModule,
    MatBadgeModule,
    MatSelectModule,
    MatTooltipModule
  ],
  declarations: [
    SubstanceFormNamesCardComponent,
    NameFormComponent,
    NameOrgsComponent
  ]
})
export class SubstanceFormNamesModule { }
