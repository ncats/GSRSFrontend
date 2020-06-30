import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceDisulfideLinksComponent } from './substance-disulfide-links.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import {RouterModule} from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
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
