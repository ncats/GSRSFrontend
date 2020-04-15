
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SubstanceFormModule } from '../substance-form.module';
import {SubstanceFormConstituentsCardComponent} from '@gsrs-core/substance-form/constituents/substance-form-constituents-card.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ScrollToModule} from '@gsrs-core/scroll-to';
import {MatPaginatorModule} from '@angular/material/paginator';
import { ConstituentFormComponent } from './constituent-form.component';
import { SubstanceSelectorModule } from '@gsrs-core/substance-selector/substance-selector.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormConstituentsCardComponent),
    SubstanceFormModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    ScrollToModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    MatInputModule,
    SubstanceSelectorModule
  ],
  declarations: [
    SubstanceFormConstituentsCardComponent,
    ConstituentFormComponent
  ]
})
export class SubstanceFormConstituentsModule { }
