import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import {SubstanceFormAgentModificationsCardComponent} from '@gsrs-core/substance-form/agent-modifications/substance-form-agent-modifications-card.component';
import {AgentModificationFormComponent} from '@gsrs-core/substance-form/agent-modifications/agent-modification-form.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormAgentModificationsCardComponent),
    SubstanceFormModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    ScrollToModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    MatInputModule
  ],
  declarations: [
    SubstanceFormAgentModificationsCardComponent,
    AgentModificationFormComponent
  ]
})
export class SubstanceFormAgentModificationsModule { }
