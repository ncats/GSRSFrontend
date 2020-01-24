<<<<<<< HEAD
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceFormDefinitionComponent } from './substance-form-definition.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SubstanceFormModule } from '../substance-form.module';
import { ScrollToModule } from '../../scroll-to/scroll-to.module';
import { SubstanceSelectorModule } from '../../substance-selector/substance-selector.module';
import {MatTooltipModule} from "@angular/material/tooltip";
import {RouterModule} from "@angular/router";

@NgModule({
    imports: [
        CommonModule,
        DynamicComponentLoaderModule.forChild(SubstanceFormDefinitionComponent),
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatMenuModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        SubstanceFormModule,
        ScrollToModule,
        SubstanceSelectorModule,
        MatTooltipModule,
        RouterModule
    ],
  declarations: [
    SubstanceFormDefinitionComponent
  ]
})
export class SubstanceFormDefinitionModule { }
=======
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceFormDefinitionComponent } from './substance-form-definition.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SubstanceFormModule } from '../substance-form.module';
import { ScrollToModule } from '../../scroll-to/scroll-to.module';
import { SubstanceSelectorModule } from '../../substance-selector/substance-selector.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormDefinitionComponent),
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    SubstanceFormModule,
    ScrollToModule,
    SubstanceSelectorModule
  ],
  declarations: [
    SubstanceFormDefinitionComponent
  ]
})
export class SubstanceFormDefinitionModule { }
>>>>>>> development_version_update
