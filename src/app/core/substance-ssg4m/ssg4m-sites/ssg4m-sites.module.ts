import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SubstanceFormNotesCardComponent } from './substance-form-notes-card.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceFormModule } from '../../substance-form/substance-form.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ScrollToModule } from '../../scroll-to/scroll-to.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
// import { SubstanceFormSsg4mSitesCardComponent} from '../ssg4m-sites/ssg4m-sites.module'
import { Ssg4mSitesComponent } from './ssg4m-sites.component';
import { SubstanceFormSsg4mSitesCardComponent } from './substance-form-ssg4m-sites-card.component';

@NgModule({
  imports: [
    CommonModule,
    SubstanceFormModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    ScrollToModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    MatInputModule
  ],
  declarations: [
    SubstanceFormSsg4mSitesCardComponent,
    Ssg4mSitesComponent
  ],
  exports: [
    SubstanceFormSsg4mSitesCardComponent,
    Ssg4mSitesComponent
  ]
})

export class Ssg4mSitesModule { }
