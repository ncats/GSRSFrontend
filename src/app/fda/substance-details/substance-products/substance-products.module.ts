import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentLoaderModule } from '@gsrs-core/dynamic-component-loader';
import { SubstanceProductsComponent } from './substance-products.component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SubstanceApplicationComponent } from './substance-application/substance-application.component';
import { SubstanceClinicalTrialsComponent } from './substance-clinical-trials/substance-clinical-trials.component';
import { SubstanceAdverseEventPtComponent } from './substance-adverseevent/adverseeventpt/substance-adverseeventpt.component';
import { SubstanceAdverseEventDmeComponent } from './substance-adverseevent/adverseeventdme/substance-adverseeventdme.component';
import { SubstanceAdverseEventCvmComponent } from './substance-adverseevent/adverseeventcvm/substance-adverseeventcvm.component';
import { SubstanceClinicalTrialsEuropeComponent } from './substance-clinical-trials-eu/substance-clinical-trials-eu.component';
@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceProductsComponent),
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  declarations: [
    SubstanceProductsComponent,
    SubstanceApplicationComponent,
    SubstanceClinicalTrialsComponent,
    SubstanceAdverseEventPtComponent,
    SubstanceAdverseEventDmeComponent,
    SubstanceAdverseEventCvmComponent,
    SubstanceClinicalTrialsEuropeComponent,
  ]
})
export class SubstanceProductsModule { }
