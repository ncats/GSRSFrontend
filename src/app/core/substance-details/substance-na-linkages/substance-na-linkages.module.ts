import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SubstanceNaLinkagesComponent} from './substance-na-linkages.component';
import {DynamicComponentLoaderModule} from '../../dynamic-component-loader/dynamic-component-loader.module';
import {MatInputModule, MatPaginatorModule, MatTableModule} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceNaLinkagesComponent),
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatInputModule,
  ],
  declarations: [SubstanceNaLinkagesComponent]
})
export class SubstanceNaLinkagesModule { }
