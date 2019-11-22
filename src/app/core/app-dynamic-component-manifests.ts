import {
  DynamicComponentManifest,
} from './dynamic-component-loader/dynamic-component-loader.module';

export const dynamicComponentManifests: DynamicComponentManifest[] = [
  {
    componentId: 'structure-details',
    path: 'structure-details',
    loadChildren: './substance-details/structure-details/structure-details.module#StructureDetailsModule',
  },
  {
    componentId: 'substance-audit-info',
    path: 'substance-audit-info',
    loadChildren: './substance-details/substance-audit-info/substance-audit-info.module#SubstanceAuditInfoModule',
  },
  {
    componentId: 'substance-codes',
    path: 'substance-codes',
    loadChildren: './substance-details/substance-codes/substance-codes.module#SubstanceCodesModule',
  },
  {
    componentId: 'substance-subunits',
    path: 'substance-subunits',
    loadChildren: './substance-details/substance-subunits/substance-subunits.module#SubstanceSubunitsModule',
  },
  {
    componentId: 'substance-moieties',
    path: 'substance-moieties',
    loadChildren: './substance-details/substance-moieties/substance-moieties.module#SubstanceMoietiesModule',
  },
  {
    componentId: 'substance-names',
    path: 'substance-names',
    loadChildren: './substance-details/substance-names/substance-names.module#SubstanceNamesModule',
  },
  {
    componentId: 'substance-notes',
    path: 'substance-notes',
    loadChildren: './substance-details/substance-notes/substance-notes.module#SubstanceNotesModule',
  },
  {
    componentId: 'substance-overview',
    path: 'substance-overview',
    loadChildren: './substance-details/substance-overview/substance-overview.module#SubstanceOverviewModule',
  },
  {
    componentId: 'substance-references',
    path: 'substance-references',
    loadChildren: './substance-details/substance-references/substance-references.module#SubstanceReferencesModule',
  },
  {
    componentId: 'substance-relationships',
    path: 'substance-relationships',
    loadChildren: './substance-details/substance-relationships/substance-relationships.module#SubstanceRelationshipsModule',
  },
  {
    componentId: 'substance-concept-definition',
    path: 'substance-concept-definition',
    loadChildren: './substance-details/substance-concept-definition/substance-concept-definition.module#SubstanceConceptDefinitionModule',
  },
  {
    componentId: 'substance-polymer-structure',
    path: 'substance-polymer-structure',
    loadChildren: './substance-details/substance-polymer-structure/substance-polymer-structure.module#SubstancePolymerStructureModule',
  },
  {
    componentId: 'substance-monomers',
    path: 'substance-monomers',
    loadChildren: './substance-details/substance-monomers/substance-monomers.module#SubstanceMonomersModule',
  },
  {
    componentId: 'substance-mixture-components',
    path: 'substance-mixture-components',
    loadChildren: './substance-details/substance-mixture-components/substance-mixture-components.module#SubstanceMixtureComponentsModule',
  },
  {
    componentId: 'substance-modifications',
    path: 'substance-modifications',
    loadChildren: './substance-details/substance-modifications/substance-modifications.module#SubstanceModificationsModule',
  },
  {
    componentId: 'substance-disulfide-links',
    path: 'substance-disulfide-links',
    loadChildren: './substance-details/substance-disulfide-links/substance-disulfide-links.module#SubstanceDisulfideLinksModule',
  },
  {
    componentId: 'substance-other-links',
    path: 'substance-other-links',
    loadChildren: './substance-details/substance-other-links/substance-other-links.module#SubstanceOtherLinksModule',
  },
  {
    componentId: 'substance-glycosylation',
    path: 'substance-glycosylation',
    loadChildren: './substance-details/substance-glycosylation/substance-glycosylation.module#SubstanceGlycosylationModule',
  },
  {
    componentId: 'substance-na-sugars',
    path: 'substance-na-sugars',
    loadChildren: './substance-details/substance-na-sugars/substance-na-sugars.module#SubstanceNaSugarsModule',
  },
  {
    componentId: 'substance-na-linkages',
    path: 'substance-na-linkages',
    loadChildren: './substance-details/substance-na-linkages/substance-na-linkages.module#SubstanceNaLinkagesModule',
  },
  {
    componentId: 'substance-properties',
    path: 'substance-properties',
    loadChildren: './substance-details/substance-properties/substance-properties.module#SubstancePropertiesModule',
  },
  {
    componentId: 'substance-primary-definition',
    path: 'substance-primary-definition',
    loadChildren: './substance-details/substance-primary-definition/substance-primary-definition.module#SubstancePrimaryDefinitionModule',
  },
  {
    componentId: 'substance-variant-concepts',
    path: 'substance-variant-concepts',
    loadChildren: './substance-details/substance-variant-concepts/substance-variant-concepts.module#SubstanceVariantConceptsModule',
  },
  {
    componentId: 'substance-mixture-source',
    path: 'substance-mixture-source',
    loadChildren: './substance-details/substance-mixture-source/substance-mixture-source.module#SubstanceMixtureSourceModule',
  },
  {
    componentId: 'substance-history',
    path: 'substance-history',
    loadChildren: './substance-details/substance-history/substance-history.module#SubstanceHistoryModule',
  },
  {
    componentId: 'substance-form-definition',
    path: 'substance-form-definition',
    loadChildren: './substance-form/substance-form-definition/substance-form-definition.module#SubstanceFormDefinitionModule',
  },
  {
    componentId: 'substance-form-references',
    path: 'substance-form-references',
    loadChildren: './substance-form/substance-form-references/substance-form-references.module#SubstanceFormReferencesModule',
  },
  {
    componentId: 'substance-form-names',
    path: 'substance-form-names',
    loadChildren: './substance-form/substance-form-names/substance-form-names.module#SubstanceFormNamesModule',
  },
  {
    componentId: 'substance-form-structure',
    path: 'substance-form-structure',
    loadChildren: './substance-form/substance-form-structure/substance-form-structure.module#SubstanceFormStructureModule',
  },
  {
    componentId: 'substance-form-moieties',
    path: 'substance-form-moieties',
    loadChildren: './substance-form/substance-form-moieties/substance-form-moieties.module#SubstanceFormMoietiesModule',
  },
  {
    componentId: 'substance-form-codes',
    path: 'substance-form-codes',
    loadChildren: './substance-form/substance-form-codes/substance-form-codes.module#SubstanceFormCodesModule',
  },
  {
    componentId: 'substance-form-relationships',
    path: 'substance-form-relationships',
    loadChildren: './substance-form/substance-form-relationships/substance-form-relationships.module#SubstanceFormRelationshipsModule',
  },
  {
    componentId: 'substance-form-notes',
    path: 'substance-form-notes',
    loadChildren: './substance-form/substance-form-notes/substance-form-notes.module#SubstanceFormNotesModule',
  },
  {
    componentId: 'substance-form-properties',
    path: 'substance-form-properties',
    loadChildren: './substance-form/substance-form-properties/substance-form-properties.module#SubstanceFormPropertiesModule'
  },
  {
    componentId: 'substance-form-subunits',
    path: 'substance-form-subunits',
    loadChildren: './substance-form/substance-form-subunits/substance-form-subunits.module#SubstanceFormSubunitsModule'
  },
  {
    componentId: 'substance-form-other-links',
    path: 'substance-form-other-links',
    loadChildren: './substance-form/substance-form-other-links/substance-form-other-links.module#SubstanceFormOtherLinksModule'
  },
  {
    componentId: 'substance-form-disulfide-links',
    path: 'substance-form-disulfide-links',
    loadChildren: './substance-form/substance-form-disulfide-links/substance-form-disulfide-links.module#SubstanceFormDisulfideLinksModule'
  },
  {
    componentId: 'substance-form-glycosylation',
    path: 'substance-form-glycosylation',
    loadChildren: './substance-form/substance-form-glycosylation/substance-form-glycosylation.module#SubstanceFormGlycosylationModule'
  },
  {
    componentId: 'substance-form-structural-modifications',
    path: 'substance-form-structural-modifications',
    loadChildren: './substance-form/substance-form-structural-modifications/substance-form-structural-modifications.module#SubstanceFormStructuralModificationsModule'
  },
  {
    componentId: 'substance-form-agent-modifications',
    path: 'substance-form-agent-modifications',
    loadChildren: './substance-form/substance-form-agent-modifications/substance-form-agent-modifications.module#SubstanceFormAgentModificationsModule'
  },
  {
    componentId: 'substance-form-physical-modifications',
    path: 'substance-form-physical-modifications',
    loadChildren: './substance-form/substance-form-physical-modifications/substance-form-physical-modifications.module#SubstanceFormPhysicalModificationsModule'
  },
  {
    componentId: 'substance-form-protein-details',
    path: 'substance-form-protein-details',
    loadChildren: './substance-form/substance-form-protein-details/substance-form-protein-details.module#SubstanceFormProteinDetailsModule'
  },
  {
    componentId: 'nucleic-acid-details-form',
    path: 'nucleic-acid-details-form',
    loadChildren: './substance-form/nucleic-acid-details-form/nucleic-acid-details-form.module#NucleicAcidDetailsFormModule'
  },
  {
    componentId: 'substance-form-links',
    path: 'substance-form-links',
    loadChildren: './substance-form/substance-form-links/substance-form-links.module#SubstanceFormLinksModule'
  },
  {
    componentId: 'substance-form-sugars',
    path: 'substance-form-sugars',
    loadChildren: './substance-form/substance-form-sugars/substance-form-sugars.module#SubstanceFormSugarsModule'
  },
  {
    componentId: 'substance-form-mixture-details',
    path: 'substance-form-mixture-details',
    loadChildren: './substance-form/substance-form-mixture-details/substance-form-mixture-details.module#SubstanceFormMixtureDetailsModule'
  },
  {
    componentId: 'substance-form-mixture-components',
    path: 'substance-form-mixture-components',
    loadChildren: './substance-form/substance-form-mixture-components/substance-form-mixture-components.module#SubstanceFormMixtureComponentsModule'
  },
  {
    componentId: 'substance-form-structurally-diverse-source',
    path: 'substance-form-structurally-diverse-source',
    loadChildren: './substance-form/substance-form-structurally-diverse-source/substance-form-structurally-diverse-source.module#SubstanceFormStructurallyDiverseSourceModule'
  },{
    componentId: 'substance-form-structurally-diverse-organism',
    path: 'substance-form-structurally-diverse-organism',
    loadChildren: './substance-form/substance-form-structurally-diverse-organism/substance-form-structurally-diverse-organism.module#SubstanceFormStructurallyDiverseOrganismModule'
  }
];
