import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceFormNamesCardComponent } from './substance-form-names-card.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceFormModule } from '../substance-form.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ScrollToModule } from '../../scroll-to/scroll-to.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { NameFormComponent } from './name-form.component';
import { NameOrgsComponent } from './name-orgs.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatBadgeModule} from '@angular/material/badge';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ElementLabelDisplayModule } from '@gsrs-core/utils/element-label-display.module';


@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormNamesCardComponent),
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
    MatRadioModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatTableModule,
    MatBadgeModule,
    MatSelectModule,
    MatTooltipModule,
    ElementLabelDisplayModule
  ],
  declarations: [
    SubstanceFormNamesCardComponent,
    NameFormComponent,
    NameOrgsComponent
    
  ]
})
export class SubstanceFormNamesModule { }
