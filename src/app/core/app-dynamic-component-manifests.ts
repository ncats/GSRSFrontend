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
  }
];
