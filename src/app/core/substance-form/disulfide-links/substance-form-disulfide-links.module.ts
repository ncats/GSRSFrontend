import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DynamicComponentLoaderModule} from '@gsrs-core/dynamic-component-loader';
import {SubstanceFormModule} from '@gsrs-core/substance-form/substance-form.module';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ScrollToModule} from '@gsrs-core/scroll-to';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
// tslint:disable-next-line:max-line-length
import {SubstanceFormDisulfideLinksCardComponent} from '@gsrs-core/substance-form/disulfide-links/substance-form-disulfide-links-card.component';
import { DisulfideLinksFormComponent } from './disulfide-links-form.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormDisulfideLinksCardComponent),
    SubstanceFormModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    ScrollToModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatInputModule
  ],
  exports: [
    DisulfideLinksFormComponent
  ],
  declarations: [
    SubstanceFormDisulfideLinksCardComponent,
    DisulfideLinksFormComponent
  ]
})
export class SubstanceFormDisulfideLinksModule { }
