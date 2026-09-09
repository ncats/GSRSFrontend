import {
    LazyLoadedComponentDefinition
} from './dynamic-component-loader/dynamic-component-manifest';

/**
 * Maps a componentId to the standalone component it lazily loads, consumed via
 * DynamicComponentLoader.getDynamicComponent()/LAZY_LOADED_COMPONENT_DEFINITIONS.
 */
export const dynamicComponentDefinitions: LazyLoadedComponentDefinition[] = [
    {
        componentId: 'structure-details',
        loadComponent: () => import('./substance-details/structure-details/structure-details.component').then(m => m.StructureDetailsComponent),
    },
    {
        componentId: 'substance-audit-info',
        loadComponent: () => import('./substance-details/substance-audit-info/substance-audit-info.component').then(m => m.SubstanceAuditInfoComponent),
    },
    {
        componentId: 'substance-codes',
        loadComponent: () => import('./substance-details/substance-codes/substance-codes.component').then(m => m.SubstanceCodesComponent),
    },
    {
        componentId: 'substance-subunits',
        loadComponent: () => import('./substance-details/substance-subunits/substance-subunits.component').then(m => m.SubstanceSubunitsComponent),
    },
    {
        componentId: 'substance-moieties',
        loadComponent: () => import('./substance-details/substance-moieties/substance-moieties.component').then(m => m.SubstanceMoietiesComponent),
    },
    {
        componentId: 'substance-names',
        loadComponent: () => import('./substance-details/substance-names/substance-names.component').then(m => m.SubstanceNamesComponent),
    },
    {
        componentId: 'substance-notes',
        loadComponent: () => import('./substance-details/substance-notes/substance-notes.component').then(m => m.SubstanceNotesComponent),
    },
    {
        componentId: 'substance-overview',
        loadComponent: () => import('./substance-details/substance-overview/substance-overview.component').then(m => m.SubstanceOverviewComponent),
    },
    {
        componentId: 'substance-references',
        loadComponent: () => import('./substance-details/substance-references/substance-references.component').then(m => m.SubstanceReferencesComponent),
    },
    {
        componentId: 'substance-relationships-visualization',
        loadComponent: () => import('./substance-details/substance-relationships-visualization/substance-relationships-visualization.component').then(m => m.SubstanceRelationshipsVisualizationComponent),
    },
    {
        componentId: 'substance-relationships',
        loadComponent: () => import('./substance-details/substance-relationships/substance-relationships.component').then(m => m.SubstanceRelationshipsComponent),
    },
    {
        componentId: 'substance-concept-definition',
        loadComponent: () => import('./substance-details/substance-concept-definition/substance-concept-definition.component').then(m => m.SubstanceConceptDefinitionComponent),
    },
    {
        componentId: 'substance-polymer-structure',
        loadComponent: () => import('./substance-details/substance-polymer-structure/substance-polymer-structure.component').then(m => m.SubstancePolymerStructureComponent),
    },
    {
        componentId: 'substance-monomers',
        loadComponent: () => import('./substance-details/substance-monomers/substance-monomers.component').then(m => m.SubstanceMonomersComponent),
    },
    {
        componentId: 'substance-structural-units',
        loadComponent: () => import('./substance-details/substance-structural-units/substance-structural-units.component').then(m => m.SubstanceStructuralUnitsComponent),
    },
    {
        componentId: 'substance-mixture-components',
        loadComponent: () => import('./substance-details/substance-mixture-components/substance-mixture-components.component').then(m => m.SubstanceMixtureComponentsComponent),
    },
    {
        componentId: 'substance-modifications',
        loadComponent: () => import('./substance-details/substance-modifications/substance-modifications.component').then(m => m.SubstanceModificationsComponent),
    },
    {
        componentId: 'substance-disulfide-links',
        loadComponent: () => import('./substance-details/substance-disulfide-links/substance-disulfide-links.component').then(m => m.SubstanceDisulfideLinksComponent),
    },
    {
        componentId: 'substance-other-links',
        loadComponent: () => import('./substance-details/substance-other-links/substance-other-links.component').then(m => m.SubstanceOtherLinksComponent),
    },
    {
        componentId: 'substance-glycosylation',
        loadComponent: () => import('./substance-details/substance-glycosylation/substance-glycosylation.component').then(m => m.SubstanceGlycosylationComponent),
    },
    {
        componentId: 'substance-na-sugars',
        loadComponent: () => import('./substance-details/substance-na-sugars/substance-na-sugars.component').then(m => m.SubstanceNaSugarsComponent),
    },
    {
        componentId: 'substance-na-linkages',
        loadComponent: () => import('./substance-details/substance-na-linkages/substance-na-linkages.component').then(m => m.SubstanceNaLinkagesComponent),
    },
    {
        componentId: 'substance-properties',
        loadComponent: () => import('./substance-details/substance-properties/substance-properties.component').then(m => m.SubstancePropertiesComponent),
    },
    {
        componentId: 'substance-constituents',
        loadComponent: () => import('./substance-details/substance-constituents/substance-constituents.component').then(m => m.SubstanceConstituentsComponent),
    },
    {
        componentId: 'substance-primary-definition',
        loadComponent: () => import('./substance-details/substance-primary-definition/substance-primary-definition.component').then(m => m.SubstancePrimaryDefinitionComponent),
    },
    {
        componentId: 'substance-alternative-definition',
        loadComponent: () => import('./substance-details/substance-alternative-definition/substance-alternative-definition.component').then(m => m.SubstanceAlternativeDefinitionComponent),
    },
    {
        componentId: 'substance-variant-concepts',
        loadComponent: () => import('./substance-details/substance-variant-concepts/substance-variant-concepts.component').then(m => m.SubstanceVariantConceptsComponent),
    },
    {
        componentId: 'substance-mixture-source',
        loadComponent: () => import('./substance-details/substance-mixture-source/substance-mixture-source.component').then(m => m.SubstanceMixtureSourceComponent),
    },
    {
        componentId: 'substance-mixture-parent',
        loadComponent: () => import('./substance-details/substance-mixture-parent/substance-mixture-parent.component').then(m => m.SubstanceMixtureParentComponent),
    },
    {
        componentId: 'substance-hierarchy',
        loadComponent: () => import('./substance-details/substance-hierarchy/substance-hierarchy.component').then(m => m.SubstanceHierarchyComponent),
    },
    {
        componentId: 'substance-history',
        loadComponent: () => import('./substance-details/substance-history/substance-history.component').then(m => m.SubstanceHistoryComponent),
    },
    {
        componentId: 'substance-ssg-parent-substance',
        loadComponent: () => import('./substance-details/substance-ssg-parent-substance/substance-ssg-parent-substance.component').then(m => m.SubstanceSsgParentSubstanceComponent),
    },
    {
        componentId: 'substance-ssg1-parent',
        loadComponent: () => import('./substance-details/substance-ssg1-parent/substance-ssg1-parent.component').then(m => m.SubstanceSsg1ParentComponent),
    },
    {
        componentId: 'substance-ssg-grade',
        loadComponent: () => import('./substance-details/substance-ssg-grade/substance-ssg-grade.component').then(m => m.SubstanceSsgGradeComponent),
    },
    {
        componentId: 'substance-ssg-definition',
        loadComponent: () => import('./substance-details/substance-ssg-definition/substance-ssg-definition.component').then(m => m.SubstanceSsgDefinitionComponent),
    },
    {
        componentId: 'substance-dependencies-image',
        loadComponent: () => import('./substance-details/substance-dependencies-image/substance-dependencies-image.component').then(m => m.SubstanceDependenciesImageComponent),
    },
    {
        componentId: 'substance-form-definition',
        loadComponent: () => import('./substance-form/substance-form-definition/substance-form-definition.component').then(m => m.SubstanceFormDefinitionComponent),
    },
    {
        componentId: 'substance-form-references',
        loadComponent: () => import('./substance-form/references/substance-form-references-card.component').then(m => m.SubstanceFormReferencesCardComponent),
    },
    {
        componentId: 'substance-form-simplified-references',
        loadComponent: () => import('./substance-form/simplified-references/substance-form-simplified-references-card.component').then(m => m.SubstanceFormSimplifiedReferencesCardComponent),
    },
    {
        componentId: 'substance-form-names',
        loadComponent: () => import('./substance-form/names/substance-form-names-card.component').then(m => m.SubstanceFormNamesCardComponent),
    },
    {
        componentId: 'substance-form-simplified-names',
        loadComponent: () => import('./substance-form/simplified-names/substance-form-simplified-names-card.component').then(m => m.SubstanceFormSimplifiedNamesCardComponent),
    },
    {
        componentId: 'substance-form-structure',
        loadComponent: () => import('./substance-form/structure/substance-form-structure-card.component').then(m => m.SubstanceFormStructureCardComponent),
    },
    {
        componentId: 'substance-form-moieties',
        loadComponent: () => import('./substance-form/moieties/substance-form-moieties.component').then(m => m.SubstanceFormMoietiesComponent),
    },
    {
        componentId: 'substance-form-codes-card',
        loadComponent: () => import('./substance-form/codes/substance-form-codes-card.component').then(m => m.SubstanceFormCodesCardComponent),
    },
    {
        componentId: 'substance-form-simplified-codes-card',
        loadComponent: () => import('./substance-form/simplified-codes/substance-form-simplified-codes-card.component').then(m => m.SubstanceFormSimplifiedCodesCardComponent),
    },
    {
        componentId: 'substance-form-relationships',
        loadComponent: () => import('./substance-form/relationships/substance-form-relationships-card.component').then(m => m.SubstanceFormRelationshipsCardComponent),
    },
    {
        componentId: 'substance-form-notes',
        loadComponent: () => import('./substance-form/notes/substance-form-notes-card.component').then(m => m.SubstanceFormNotesCardComponent),
    },
    {
        componentId: 'substance-form-properties',
        loadComponent: () => import('./substance-form/properties/substance-form-properties-card.component').then(m => m.SubstanceFormPropertiesCardComponent),
    },
    {
        componentId: 'substance-form-subunits',
        loadComponent: () => import('./substance-form/substance-form-subunits/substance-form-subunits.component').then(m => m.SubstanceFormSubunitsComponent),
    },
    {
        componentId: 'substance-form-other-links',
        loadComponent: () => import('./substance-form/other-links/substance-form-other-links-card.component').then(m => m.SubstanceFormOtherLinksCardComponent),
    },
    {
        componentId: 'substance-form-disulfide-links',
        loadComponent: () => import('./substance-form/disulfide-links/substance-form-disulfide-links-card.component').then(m => m.SubstanceFormDisulfideLinksCardComponent),
    },
    {
        componentId: 'substance-form-glycosylation',
        loadComponent: () => import('./substance-form/glycosylation/substance-form-glycosylation.component').then(m => m.SubstanceFormGlycosylationComponent),
    },
    {
        componentId: 'substance-form-structural-modifications',
        loadComponent: () => import('./substance-form/structural-modifications/substance-form-structural-modifications-card.component').then(m => m.SubstanceFormStructuralModificationsCardComponent),
    },
    {
        componentId: 'substance-form-agent-modifications-card',
        loadComponent: () => import('./substance-form/agent-modifications/substance-form-agent-modifications-card.component').then(m => m.SubstanceFormAgentModificationsCardComponent),
    },
    {
        componentId: 'substance-form-physical-modifications',
        loadComponent: () => import('./substance-form/physical-modifications/substance-form-physical-modifications-card.component').then(m => m.SubstanceFormPhysicalModificationsCardComponent),
    },
    {
        componentId: 'substance-form-protein-details',
        loadComponent: () => import('./substance-form/protein-details/substance-form-protein-details.component').then(m => m.SubstanceFormProteinDetailsComponent),
    },
    {
        componentId: 'nucleic-acid-details-form',
        loadComponent: () => import('./substance-form/nucleic-acid-details-form/nucleic-acid-details-form.component').then(m => m.NucleicAcidDetailsFormComponent),
    },
    {
        componentId: 'substance-form-links',
        loadComponent: () => import('./substance-form/links/substance-form-links_card.component').then(m => m.SubstanceFormLinksCardComponent),
    },
    {
        componentId: 'substance-form-sugars',
        loadComponent: () => import('./substance-form/substance-form-sugars/substance-form-sugars.component').then(m => m.SubstanceFormSugarsComponent),
    },
    {
        componentId: 'substance-form-mixture-details',
        loadComponent: () => import('./substance-form/mixture-details/substance-form-mixture-details.component').then(m => m.SubstanceFormMixtureDetailsComponent),
    },
    {
        componentId: 'substance-form-mixture-components',
        loadComponent: () => import('./substance-form/mixture-components/substance-form-mixture-components-card.component').then(m => m.SubstanceFormMixtureComponentsCardComponent),
    },
    {
        componentId: 'substance-form-structurally-diverse-source',
        loadComponent: () => import('./substance-form/structurally-diverse/substance-form-structurally-diverse-source/substance-form-structurally-diverse-source.component').then(m => m.SubstanceFormStructurallyDiverseSourceComponent),
    },
    {
        componentId: 'substance-form-structurally-diverse-organism',
        loadComponent: () => import('./substance-form/structurally-diverse/substance-form-structurally-diverse-organism/substance-form-structurally-diverse-organism.component').then(m => m.SubstanceFormStructurallyDiverseOrganismComponent),
    },
    {
        componentId: 'substance-form-constituents',
        loadComponent: () => import('./substance-form/constituents/substance-form-constituents-card.component').then(m => m.SubstanceFormConstituentsCardComponent),
    },
    {
        componentId: 'substance-form-polymer-classification',
        loadComponent: () => import('./substance-form/polymer-classification/substance-form-polymer-classification.component').then(m => m.SubstanceFormPolymerClassificationComponent),
    },
    {
        componentId: 'substance-form-monomers',
        loadComponent: () => import('./substance-form/monomers/substance-form-monomers-card.component').then(m => m.SubstanceFormMonomersCardComponent),
    },
    {
        componentId: 'substance-form-structural-units',
        loadComponent: () => import('./substance-form/structural-units/substance-form-structural-units-card.component').then(m => m.SubstanceFormStructuralUnitsCardComponent),
    },
    {
        componentId: 'substance-form-change-reason',
        loadComponent: () => import('./substance-form/substance-form-change-reason/substance-form-change-reason.component').then(m => m.SubstanceFormChangeReasonComponent),
    },
    {
        componentId: 'substance-form-ssg-parent-substance',
        loadComponent: () => import('./substance-form/ssg-parent-substance-form/ssg-parent-substance-form.component').then(m => m.SsgParentSubstanceFormComponent),
    },
    {
        componentId: 'substance-form-ssg-grade',
        loadComponent: () => import('./substance-form/ssg-grade-form/ssg-grade-form.component').then(m => m.SsgGradeFormComponent),
    },
    {
        componentId: 'substance-form-ssg-definition',
        loadComponent: () => import('./substance-form/ssg-definition-form/ssg-definition-form.component').then(m => m.SsgDefinitionFormComponent),
    },
    {
        componentId: 'substance-form-ssg4m-process',
        loadComponent: () => import('./substance-ssg4m/ssg4m-process/substance-form-ssg4m-process-card.component').then(m => m.SubstanceFormSsg4mProcessCardComponent),
    },
    {
        componentId: 'substance-form-ssg2-manufacturing',
        loadComponent: () => import('./substance-ssg2/ssg2-manufacturing/ssg2-manufacturing.component').then(m => m.Ssg2ManufacturingComponent),
    },
    {
        componentId: 'substance-form-ssg2-overview',
        loadComponent: () => import('./substance-ssg2/ssg2-overview-form/ssg2-overview-form.component').then(m => m.Ssg2OverviewFormComponent),
    },
];

