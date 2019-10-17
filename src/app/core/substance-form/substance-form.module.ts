import { NgModule } from '@angular/core';
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
import { NameFormComponent } from './name-form/name-form.component';
import { MatRadioModule } from '@angular/material/radio';
import { ExpandDetailsModule } from '../expand-details/expand-details.module';
import { NameOrgsComponent } from './name-form/name-orgs/name-orgs.component';
import { StructureFormComponent } from './structure-form/structure-form.component';
import { AmountFormComponent } from './amount-form/amount-form.component';
import { CodeFormComponent } from './code-form/code-form.component';
import { RelationshipFormComponent } from './relationship-form/relationship-form.component';
import { SubstanceSelectorModule } from '../substance-selector/substance-selector.module';
import { ApplyReferenceComponent } from './apply-reference/apply-reference.component';
import { NoteFormComponent } from './note-form/note-form.component';
import { PropertyFormComponent } from './property-form/property-form.component';
import { PropertyParameterFormComponent } from './property-parameter-form/property-parameter-form.component';
import { PropertyParameterDialogComponent } from './property-parameter-dialog/property-parameter-dialog.component';
import { MatListModule } from '@angular/material/list';
import { FileSelectModule } from 'file-select';
import { SubunitFormComponent } from './subunit-form/subunit-form.component';
import {SubunitDisplayPipe} from '@gsrs-core/utils/subunit-display.pipe';
import { OtherLinksFormComponent } from './other-links-form/other-links-form.component';
import {DisulfideLinksFormComponent} from '@gsrs-core/substance-form/disulfide-links-form/disulfide-links-form.component';
import {SubunitSelectorComponent} from '@gsrs-core/substance-form/subunit-selector/subunit-selector.component';
import {SubunitSelectorDialogComponent} from '@gsrs-core/substance-form/subunit-selector-dialog/subunit-selector-dialog.component';
import {StructuralModificationFormComponent} from '@gsrs-core/substance-form/structural-modification-form/structural-modification-form.component';
import {AgentModificationFormComponent} from '@gsrs-core/substance-form/agent-modification-form/agent-modification-form.component';
import {PhysicalModificationFormComponent} from '@gsrs-core/substance-form/physical-modification-form/physical-modification-form.component';
import {AmountFormDialogComponent} from '@gsrs-core/substance-form/amount-form-dialog/amount-form-dialog.component';
import {PhysicalParameterFormDialogComponent} from '@gsrs-core/substance-form/physical-parameter-form-dialog/physical-parameter-form-dialog.component';
import {PhysicalParameterFormComponent} from '@gsrs-core/substance-form/physical-parameter-form/physical-parameter-form.component';

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
    FileSelectModule
  ],
  declarations: [
    AccessManagerComponent,
    TagSelectorComponent,
    DomainReferencesComponent,
    ReferenceFormComponent,
    RefernceFormDialogComponent,
    ReuseReferencesDialogComponent,
    NameFormComponent,
    NameOrgsComponent,
    StructureFormComponent,
    AmountFormComponent,
    CodeFormComponent,
    RelationshipFormComponent,
    ApplyReferenceComponent,
    NoteFormComponent,
    PropertyFormComponent,
    PropertyParameterFormComponent,
    PropertyParameterDialogComponent,
    SubunitFormComponent,
    SubunitDisplayPipe,
    OtherLinksFormComponent,
    DisulfideLinksFormComponent,
    SubunitSelectorComponent,
    SubunitSelectorDialogComponent,
    StructuralModificationFormComponent,
    AgentModificationFormComponent,
    PhysicalModificationFormComponent,
    AmountFormDialogComponent,
    PhysicalParameterFormDialogComponent,
    PhysicalParameterFormComponent
  ],
  exports: [
    AccessManagerComponent,
    DomainReferencesComponent,
    ReferenceFormComponent,
    RefernceFormDialogComponent,
    ReuseReferencesDialogComponent,
    NameFormComponent,
    StructureFormComponent,
    AmountFormComponent,
    CodeFormComponent,
    RelationshipFormComponent,
    NoteFormComponent,
    PropertyFormComponent,
    PropertyParameterFormComponent,
    PropertyParameterDialogComponent,
    SubunitFormComponent,
    SubunitDisplayPipe,
    OtherLinksFormComponent,
    DisulfideLinksFormComponent,
    SubunitSelectorComponent,
    SubunitSelectorDialogComponent,
    StructuralModificationFormComponent,
    AgentModificationFormComponent,
    PhysicalModificationFormComponent,
    AmountFormDialogComponent,
    PhysicalParameterFormDialogComponent,
    PhysicalParameterFormComponent,
    TagSelectorComponent
  ],
  entryComponents: [
    RefernceFormDialogComponent,
    ReuseReferencesDialogComponent,
    ApplyReferenceComponent,
    PropertyParameterDialogComponent,
    SubunitSelectorComponent,
    SubunitSelectorDialogComponent,
    AmountFormDialogComponent,
    PhysicalParameterFormDialogComponent
  ]
})
export class SubstanceFormModule { }
