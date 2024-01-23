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
import { DomainReferencesComponent } from './references/domain-references/domain-references.component';
import { ReferenceFormComponent } from './references/reference-form.component';
import { RefernceFormDialogComponent } from './references/references-dialogs/refernce-form-dialog.component';
import { ReuseReferencesDialogComponent } from './references/references-dialogs/reuse-references-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRadioModule } from '@angular/material/radio';
import { ExpandDetailsModule } from '../expand-details/expand-details.module';
import { StructureFormComponent } from './structure/structure-form.component';
import { AmountFormComponent } from './amount-form/amount-form.component';
import { SubstanceSelectorModule } from '../substance-selector/substance-selector.module';
import { ApplyReferenceComponent } from './references/apply-reference/apply-reference.component';
import { PropertyParameterFormComponent } from './property-parameter-form/property-parameter-form.component';
import { PropertyParameterDialogComponent } from './property-parameter-dialog/property-parameter-dialog.component';
import { MatListModule } from '@angular/material/list';
import { FileSelectModule } from 'file-select';
import { SubunitFormComponent } from './subunit-form/subunit-form.component';
import {SubunitDisplayPipe} from '@gsrs-core/utils/subunit-display.pipe';
import {SubunitSelectorComponent} from '@gsrs-core/substance-form/subunit-selector/subunit-selector.component';
import {SubunitSelectorDialogComponent} from '@gsrs-core/substance-form/subunit-selector-dialog/subunit-selector-dialog.component';
import {AmountFormDialogComponent} from '@gsrs-core/substance-form/amount-form-dialog/amount-form-dialog.component';
import {PhysicalParameterFormDialogComponent} from '@gsrs-core/substance-form/physical-parameter-form-dialog/physical-parameter-form-dialog.component';
import {PhysicalParameterFormComponent} from '@gsrs-core/substance-form/physical-parameter-form/physical-parameter-form.component';
import {CvInputComponent} from '@gsrs-core/substance-form/cv-input/cv-input.component';
import {SugarFormComponent} from '@gsrs-core/substance-form/sugar-form/sugar-form.component';
import {CvDialogComponent} from '@gsrs-core/substance-form/cv-dialog/cv-dialog.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {JsonDialogComponent} from '@gsrs-core/substance-form/json-dialog/json-dialog.component';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {AuditInfoComponent} from '@gsrs-core/substance-form/audit-info/audit-info.component';
import { RouterModule } from '@angular/router';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { SubmitSuccessDialogComponent } from './submit-success-dialog/submit-success-dialog.component';
import {MergeConceptDialogComponent} from '@gsrs-core/substance-form/merge-concept-dialog/merge-concept-dialog.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {DefinitionSwitchDialogComponent} from '@gsrs-core/substance-form/definition-switch-dialog/definition-switch-dialog.component';
import { SubstanceFormComponent } from './substance-form.component';
import { CanActivateSubstanceForm } from './can-activate-substance-form';
import { CanRegisterSubstanceForm } from './can-register-substance-form';
import { SubstanceFormService } from './substance-form.service';
import { SubstanceFormStructureService } from './structure/substance-form-structure.service';
import { SubstanceFormDisulfideLinksService } from './disulfide-links/substance-form-disulfide-links.service';
import { SubstanceFormGlycosylationService } from './glycosylation/substance-form-glycosylation.service';
import { SubstanceFormPropertiesService } from './properties/substance-form-properties.service';
import { SubstanceFormReferencesService } from './references/substance-form-references.service';
import { SubstanceFormStructuralUnitsService } from './structural-units/substance-form-structural-units.service';
import { SubstanceFormStructurallyDiverseService } from './structurally-diverse/substance-form-structurally-diverse.service';
import { SubstanceFormNamesService } from './names/substance-form-names.service';
import { SubstanceFormLinksService } from './links/substance-form-links.service';
import { SubstanceFormCodesService } from './codes/substance-form-codes.service';
import { SubstanceFormAgentModificationsService } from './agent-modifications/substance-form-agent-modifications.service';
import { SubstanceFormConstituentsService } from './constituents/substance-form-constituents.service';
import { SubstanceFormMixtureComponentsService } from './mixture-components/substance-form-mixture-components.service';
import { SubstanceFormMonomersService } from './monomers/substance-form-monomers.service';
import { SubstanceFormNotesService } from './notes/substance-form-notes.service';
import { SubstanceFormOtherLinksService } from './other-links/substance-form-other-links.service';
import { SubstanceFormPhysicalModificationsService } from './physical-modifications/substance-form-physical-modifications.service';
import { SubstanceFormPolymerClassificationService } from './polymer-classification/substance-form-polymer-classification.service';
import { SubstanceFormRelationshipsService } from './relationships/substance-form-relationships.service';
import { SubstanceFormStructuralModificationsService } from './structural-modifications/substance-form-structural-modifications.service';
import { PreviousReferencesComponent } from '@gsrs-core/substance-form/references/previous-references/previous-references.component';
import { PreviousReferencesDialogComponent } from '@gsrs-core/substance-form/references/previous-references/previous-references-dialog/previous-references-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CopyDisulfideDialogComponent } from '@gsrs-core/substance-form/copy-disulfide-dialog/copy-disulfide-dialog.component';
import { FragmentWizardComponent } from '@gsrs-core/admin/fragment-wizard/fragment-wizard.component';
import { SubstanceDraftsComponent } from '@gsrs-core/substance-form/substance-drafts/substance-drafts.component';
import { MatSortModule } from '@angular/material/sort';
import { ElementLabelDisplayModule } from '@gsrs-core/utils/element-label-display.module';
import { SimplifiedCodesComponent } from './simplified-codes/simplified-codes.component';

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
    SubstanceImageModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSortModule,
    ElementLabelDisplayModule
  ],
  declarations: [
    SubstanceFormComponent,
    AccessManagerComponent,
    TagSelectorComponent,
    DomainReferencesComponent,
    ReferenceFormComponent,
    RefernceFormDialogComponent,
    PreviousReferencesComponent,
    ReuseReferencesDialogComponent,
    StructureFormComponent,
    AmountFormComponent,
    ApplyReferenceComponent,
    PropertyParameterFormComponent,
    PropertyParameterDialogComponent,
    SubunitFormComponent,
    SubunitDisplayPipe,
    SugarFormComponent,
    SubunitSelectorComponent,
    SubunitSelectorDialogComponent,
    AmountFormDialogComponent,
    PhysicalParameterFormDialogComponent,
    PhysicalParameterFormComponent,
    CvInputComponent,
    CvDialogComponent,
    JsonDialogComponent,
    AuditInfoComponent,
    SubmitSuccessDialogComponent,
    MergeConceptDialogComponent,
    DefinitionSwitchDialogComponent,
    PreviousReferencesDialogComponent,
    CopyDisulfideDialogComponent,
    SubstanceDraftsComponent,
    SimplifiedCodesComponent
  ],
  exports: [
    SubstanceFormComponent,
    AccessManagerComponent,
    DomainReferencesComponent,
    ReferenceFormComponent,
    PreviousReferencesComponent,
    RefernceFormDialogComponent,
    ReuseReferencesDialogComponent,
    StructureFormComponent,
    AmountFormComponent,
    PropertyParameterFormComponent,
    PropertyParameterDialogComponent,
    SubunitFormComponent,
    SubunitDisplayPipe,
    SubunitSelectorComponent,
    SubunitSelectorDialogComponent,
    AmountFormDialogComponent,
    PhysicalParameterFormDialogComponent,
    PhysicalParameterFormComponent,
    TagSelectorComponent,
    SugarFormComponent,
    CvInputComponent,
    CvDialogComponent,
    JsonDialogComponent,
    AuditInfoComponent,
    MergeConceptDialogComponent,
    DefinitionSwitchDialogComponent,
    PreviousReferencesDialogComponent,
    CopyDisulfideDialogComponent,
    SubstanceDraftsComponent
  ],
  entryComponents: [
    RefernceFormDialogComponent,
    ReuseReferencesDialogComponent,
    ApplyReferenceComponent,
    PreviousReferencesComponent,
    PropertyParameterDialogComponent,
    SubunitSelectorComponent,
    SubunitSelectorDialogComponent,
    AmountFormDialogComponent,
    PhysicalParameterFormDialogComponent,
    CvDialogComponent,
    JsonDialogComponent,
    AuditInfoComponent,
    SubmitSuccessDialogComponent,
    MergeConceptDialogComponent,
    DefinitionSwitchDialogComponent,
    PreviousReferencesDialogComponent,
    CopyDisulfideDialogComponent,
    SubstanceDraftsComponent
  ]
})
export class SubstanceFormModule {
    static forRoot(): ModuleWithProviders<any> {
      return {
        ngModule: SubstanceFormModule,
        providers: [
          SubstanceFormService,
          CanActivateSubstanceForm,
          CanRegisterSubstanceForm,
          SubstanceFormStructureService,
          SubstanceFormDisulfideLinksService,
          SubstanceFormGlycosylationService,
          SubstanceFormPropertiesService,
          SubstanceFormReferencesService,
          SubstanceFormStructuralUnitsService,
          SubstanceFormStructurallyDiverseService,
          SubstanceFormNamesService,
          SubstanceFormLinksService,
          SubstanceFormCodesService,
          SubstanceFormAgentModificationsService,
          SubstanceFormConstituentsService,
          SubstanceFormMixtureComponentsService,
          SubstanceFormMonomersService,
          SubstanceFormNotesService,
          SubstanceFormOtherLinksService,
          SubstanceFormPhysicalModificationsService,
          SubstanceFormPolymerClassificationService,
          SubstanceFormRelationshipsService,
          SubstanceFormStructuralModificationsService
        ]
      };
    }
}
