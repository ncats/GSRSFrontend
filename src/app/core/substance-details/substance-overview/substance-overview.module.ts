import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceOverviewComponent } from './substance-overview.component';
import {ReferencesManagerModule} from '../../references-manager/references-manager.module';
import {MatExpansionModule, MatIconModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceOverviewComponent),
    ReferencesManagerModule,
    MatExpansionModule,
    MatIconModule,
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule
  ],
  declarations: [SubstanceOverviewComponent]
})
export class SubstanceOverviewModule { }
