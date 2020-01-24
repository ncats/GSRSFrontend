import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceGlycosylationComponent } from './substance-glycosylation.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import {RouterModule} from '@angular/router';
import {MatInputModule, MatPaginatorModule, MatTableModule} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceGlycosylationComponent),
    RouterModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatInputModule,
  ],
  declarations: [SubstanceGlycosylationComponent]
})
export class SubstanceGlycosylationModule { }
