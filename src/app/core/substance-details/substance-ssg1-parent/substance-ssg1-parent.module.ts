import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material';
import { ReferencesManagerModule } from '@gsrs-core/references-manager';
import { DynamicComponentLoaderModule } from '@gsrs-core/dynamic-component-loader';
import { SubstanceSsg1ParentComponent } from '@gsrs-core/substance-details/substance-ssg1-parent/substance-ssg1-parent.component';



@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceSsg1ParentComponent),
    ReferencesManagerModule,
    MatDialogModule,
    RouterModule,
    SubstanceImageModule
  ],
  declarations: [
    SubstanceSsg1ParentComponent
  ]
})
export class SubstanceSsg1ParentModule { }
