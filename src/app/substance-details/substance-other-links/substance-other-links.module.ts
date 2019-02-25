import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceOtherLinksComponent } from './substance-other-links.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import {RouterModule} from '@angular/router';
import {MatInputModule, MatPaginatorModule, MatTableModule} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
imports: [
  CommonModule,
  DynamicComponentLoaderModule.forChild(SubstanceOtherLinksComponent),
  RouterModule,
  MatTableModule,
  CdkTableModule,
  MatPaginatorModule,
  MatInputModule,
  ReactiveFormsModule,
  FormsModule
],
  declarations: [SubstanceOtherLinksComponent]
})
export class SubstanceOtherLinksModule { }
