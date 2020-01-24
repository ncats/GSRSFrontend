import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceAuditInfoComponent } from './substance-audit-info.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceAuditInfoComponent)
  ],
  declarations: [SubstanceAuditInfoComponent]
})
export class SubstanceAuditInfoModule { }
