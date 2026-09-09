import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SubstanceFormNamesCardComponent } from "./substance-form-names-card.component";
import { DynamicComponentLoaderModule } from "../../dynamic-component-loader/dynamic-component-loader.module";

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormNamesCardComponent),
    SubstanceFormNamesCardComponent
  ],
})
export class SubstanceFormNamesModule {}
