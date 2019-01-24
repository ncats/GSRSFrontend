import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DynamicComponentLoaderModule} from '../../dynamic-component-loader/dynamic-component-loader.module';
import {RouterModule} from '@angular/router';
import {SubstanceModifications} from '../../substance/substance.model';
import {SubstanceModificationsComponent} from './substance-modifications.component';
import {MatTableModule} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceModificationsComponent),
    RouterModule,
    MatTableModule,
    CdkTableModule
  ],
  declarations: [SubstanceModificationsComponent]
})
export class SubstanceModificationsModule { }
