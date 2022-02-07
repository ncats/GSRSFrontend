import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceModificationsComponent } from './substance-modifications.component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceModificationsComponent),
    MatTableModule,
    CdkTableModule,
    RouterModule
  ],
  declarations: [SubstanceModificationsComponent]
})
export class SubstanceModificationsModule { }
