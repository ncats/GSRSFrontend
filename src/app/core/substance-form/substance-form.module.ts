import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessManagerComponent } from './access-manager/access-manager.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { TagSelectorComponent } from './tag-selector/tag-selector.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ScrollToModule } from '../scroll-to/scroll-to.module';
import { DomainReferencesComponent } from './domain-references/domain-references.component';
import { ReferenceFormComponent } from './reference-form/reference-form.component';
import { RefernceFormDialogComponent } from './references-dialogs/refernce-form-dialog.component';
import { ReuseReferencesDialogComponent } from './references-dialogs/reuse-references-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRadioModule } from '@angular/material/radio';
import { ExpandDetailsModule } from '../expand-details/expand-details.module';
import { StructureFormComponent } from './structure-form/structure-form.component';
import { AmountFormComponent } from './amount-form/amount-form.component';
import { RelationshipFormComponent } from './relationship-form/relationship-form.component';
import { SubstanceSelectorModule } from '../substance-selector/substance-selector.module';
import { ApplyReferenceComponent } from './apply-reference/apply-reference.component';
import { PropertyParameterFormComponent } from './property-parameter-form/property-parameter-form.component';
import { PropertyParameterDialogComponent } from './property-parameter-dialog/property-parameter-dialog.component';
import { MatListModule } from '@angular/material/list';
import { FileSelectModule } from 'file-select';
import { SubunitFormComponent } from './subunit-form/subunit-form.component';
import {SubunitDisplayPipe} from '@gsrs-core/utils/subunit-display.pipe';
import {SubunitSelectorComponent} from '@gsrs-core/substance-form/subunit-selector/subunit-selector.component';
import {SubunitSelectorDialogComponent} from '@gsrs-core/substance-form/subunit-selector-dialog/subunit-selector-dialog.component';
import {StructuralModificationFormComponent} from '@gsrs-core/substance-form/structural-modification-form/structural-modification-form.component';
import {AmountFormDialogComponent} from '@gsrs-core/substance-form/amount-form-dialog/amount-form-dialog.component';
import {PhysicalParameterFormDialogComponent} from '@gsrs-core/substance-form/physical-parameter-form-dialog/physical-parameter-form-dialog.component';
import {PhysicalParameterFormComponent} from '@gsrs-core/substance-form/physical-parameter-form/physical-parameter-form.component';
import {CvInputComponent} from '@gsrs-core/substance-form/cv-input/cv-input.component';
import {SugarFormComponent} from '@gsrs-core/substance-form/sugar-form/sugar-form.component';
import {CvDialogComponent} from '@gsrs-core/substance-form/cv-dialog/cv-dialog.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {StructuralUnitFormComponent} from '@gsrs-core/substance-form/structural-unit-form/structural-unit-form.component';
import {JsonDialogComponent} from '@gsrs-core/substance-form/json-dialog/json-dialog.component';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {AuditInfoComponent} from '@gsrs-core/substance-form/audit-info/audit-info.component';
import { RouterModule } from '@angular/router';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { SubmitSuccessDialogComponent } from './submit-success-dialog/submit-success-dialog.component';
import { SubstanceFormComponent } from './substance-form.component';
import { CanActivateSubstanceForm } from './can-activate-substance-form';
import { CanRegisterSubstanceForm } from './can-register-substance-form';
import { SubstanceFormService } from './substance-form.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatMenuModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTabsModule,
    MatDividerModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    ScrollToModule,
    MatDialogModule,
    MatTableModule,
    MatExpansionModule,
    MatBadgeModule,
    MatRadioModule,
    ExpandDetailsModule,
    SubstanceSelectorModule,
    MatListModule,
    FileSelectModule,
    MatButtonToggleModule,
    NgxJsonViewerModule,
    RouterModule,
    SubstanceImageModule
  ],
  declarations: [
    SubstanceFormComponent,
    AccessManagerComponent,
    TagSelectorComponent,
    DomainReferencesComponent,
    ReferenceFormComponent,
    RefernceFormDialogComponent,
    ReuseReferencesDialogComponent,
    StructureFormComponent,
    AmountFormComponent,
    RelationshipFormComponent,
    ApplyReferenceComponent,
    PropertyParameterFormComponent,
    PropertyParameterDialogComponent,
    SubunitFormComponent,
    SubunitDisplayPipe,
    SugarFormComponent,
    SubunitSelectorComponent,
    SubunitSelectorDialogComponent,
    StructuralModificationFormComponent,
    AmountFormDialogComponent,
    PhysicalParameterFormDialogComponent,
    PhysicalParameterFormComponent,
    CvInputComponent,
    CvDialogComponent,
    StructuralUnitFormComponent,
    JsonDialogComponent,
    AuditInfoComponent,
    SubmitSuccessDialogComponent
  ],
  exports: [
    SubstanceFormComponent,
    AccessManagerComponent,
    DomainReferencesComponent,
    ReferenceFormComponent,
    RefernceFormDialogComponent,
    ReuseReferencesDialogComponent,
    StructureFormComponent,
    AmountFormComponent,
    RelationshipFormComponent,
    PropertyParameterFormComponent,
    PropertyParameterDialogComponent,
    SubunitFormComponent,
    SubunitDisplayPipe,
    SubunitSelectorComponent,
    SubunitSelectorDialogComponent,
    StructuralModificationFormComponent,
    AmountFormDialogComponent,
    PhysicalParameterFormDialogComponent,
    PhysicalParameterFormComponent,
    TagSelectorComponent,
    SugarFormComponent,
    CvInputComponent,
    CvDialogComponent,
    StructuralUnitFormComponent,
    JsonDialogComponent,
    AuditInfoComponent
  ],
  entryComponents: [
    RefernceFormDialogComponent,
    ReuseReferencesDialogComponent,
    ApplyReferenceComponent,
    PropertyParameterDialogComponent,
    SubunitSelectorComponent,
    SubunitSelectorDialogComponent,
    AmountFormDialogComponent,
    PhysicalParameterFormDialogComponent,
    CvDialogComponent,
    JsonDialogComponent,
    AuditInfoComponent,
    SubmitSuccessDialogComponent
  ]
})
export class SubstanceFormModule {
    static forRoot(): ModuleWithProviders {
      return {
        ngModule: SubstanceFormModule,
        providers: [
          SubstanceFormService,
          CanActivateSubstanceForm,
          CanRegisterSubstanceForm
        ]
      };
    }
}
