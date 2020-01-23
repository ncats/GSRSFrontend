import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SubstanceNaSugarsComponent} from './substance-na-sugars.component';
import {DynamicComponentLoaderModule} from '../../dynamic-component-loader/dynamic-component-loader.module';
import {MatInputModule, MatPaginatorModule, MatTableModule} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';


@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceNaSugarsComponent),
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatInputModule,
  ],
  declarations: [SubstanceNaSugarsComponent]
})
export class SubstanceNaSugarsModule { }
