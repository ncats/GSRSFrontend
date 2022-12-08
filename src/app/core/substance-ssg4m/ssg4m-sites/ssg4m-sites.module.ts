
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { ScrollToModule } from '../../scroll-to/scroll-to.module';
import { SubstanceFormModule } from '../../substance-form/substance-form.module';
import { Ssg4mStagesModule } from '../ssg4m-stages/substance-form-ssg4m-stages.module';
import { Ssg4mSitesComponent } from './ssg4m-sites.component';

@NgModule({
  imports: [
    CommonModule,
    SubstanceFormModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    ScrollToModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    MatInputModule,
    MatBadgeModule,
    Ssg4mStagesModule
  ],
  declarations: [
    Ssg4mSitesComponent
  ],
  exports: [
    Ssg4mSitesComponent
  ]
})

export class Ssg4mSitesModule { }
