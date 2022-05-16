import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SubstanceFormNotesCardComponent } from './substance-form-notes-card.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceFormModule } from '../../substance-form/substance-form.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { ScrollToModule } from '../../scroll-to/scroll-to.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
// import { SubstanceFormSsg4mSitesCardComponent} from '../ssg4m-sites/ssg4m-sites.module'
import { Ssg4mSitesModule } from '../ssg4m-sites/ssg4m-sites.module';
import { Ssg4mSchemeViewModule } from '../ssg4m-scheme-view/ssg4m-scheme-view.module';
import { SubstanceFormSsg4mProcessCardComponent } from './substance-form-ssg4m-process-card.component';
import { Ssg4mProcessFormComponent } from './ssg4m-process-form.component';
import { Ssg4mSitesComponent } from '../ssg4m-sites/ssg4m-sites.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormSsg4mProcessCardComponent),
    SubstanceFormModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatBadgeModule,
    ScrollToModule,
    MatPaginatorModule,
    MatInputModule,
    MatCheckboxModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    Ssg4mSitesModule,
    Ssg4mSchemeViewModule
  ],
  exports: [
    Ssg4mProcessFormComponent
  ],
  declarations: [
    SubstanceFormSsg4mProcessCardComponent,
    Ssg4mProcessFormComponent
  ]
})
export class SubstanceSsg4mProcessModule { }

