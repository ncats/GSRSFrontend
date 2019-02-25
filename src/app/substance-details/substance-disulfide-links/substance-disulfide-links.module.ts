import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceDisulfideLinksComponent } from './substance-disulfide-links.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import {RouterModule} from '@angular/router';
import {MatInputModule, MatPaginatorModule, MatTableModule} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceDisulfideLinksComponent),
    RouterModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatInputModule,
  ],
  declarations: [SubstanceDisulfideLinksComponent]
})
export class SubstanceDisulfideLinksModule { }
