import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceHierarchyComponent } from './substance-hierarchy.component';
import {MatTreeModule} from '@angular/material/tree';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DynamicComponentLoaderModule.forChild(SubstanceHierarchyComponent),
    MatTreeModule,
    MatIconModule
  ],
  declarations: [SubstanceHierarchyComponent]
})
export class SubstanceHierarchyModule { }
