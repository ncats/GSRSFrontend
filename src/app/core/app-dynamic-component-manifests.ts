import {
  DynamicComponentManifest,
} from './dynamic-component-loader/dynamic-component-loader.module';

export const dynamicComponentManifests: DynamicComponentManifest[] = [
  {
    componentId: 'structure-details',
    path: 'structure-details',
    loadChildren: () => import('./substance-details/structure-details/structure-details.module').then(m => m.StructureDetailsModule),
  },
  {
    componentId: 'substance-audit-info',
    path: 'substance-audit-info',
    loadChildren: () => import('./substance-details/substance-audit-info/substance-audit-info.module').then(m => m.SubstanceAuditInfoModule),
  },
  {
    componentId: 'substance-codes',
    path: 'substance-codes',
    loadChildren: () => import('./substance-details/substance-codes/substance-codes.module').then(m => m.SubstanceCodesModule),
  },
  {
    componentId: 'substance-subunits',
    path: 'substance-subunits',
    loadChildren: () => import('./substance-details/substance-subunits/substance-subunits.module').then(m => m.SubstanceSubunitsModule),
  },
  {
    componentId: 'substance-moieties',
    path: 'substance-moieties',
    loadChildren: () => import('./substance-details/substance-moieties/substance-moieties.module').then(m => m.SubstanceMoietiesModule),
  },
  {
    componentId: 'substance-names',
    path: 'substance-names',
    loadChildren: () => import('./substance-details/substance-names/substance-names.module').then(m => m.SubstanceNamesModule),
  },
  {
    componentId: 'substance-notes',
    path: 'substance-notes',
    loadChildren: () => import('./substance-details/substance-notes/substance-notes.module').then(m => m.SubstanceNotesModule),
  },
  {
    componentId: 'substance-overview',
    path: 'substance-overview',
    loadChildren: () => import('./substance-details/substance-overview/substance-overview.module').then(m => m.SubstanceOverviewModule),
  },
  {
    componentId: 'substance-references',
    path: 'substance-references',
    loadChildren: () => import('./substance-details/substance-references/substance-references.module').then(m => m.SubstanceReferencesModule),
  },
  {
    componentId: 'substance-relationships',
    path: 'substance-relationships',
    loadChildren: () => import('./substance-details/substance-relationships/substance-relationships.module').then(m => m.SubstanceRelationshipsModule),
  },
  {
    componentId: 'substance-concept-definition',
    path: 'substance-concept-definition',
    loadChildren: () => import('./substance-details/substance-concept-definition/substance-concept-definition.module').then(m => m.SubstanceConceptDefinitionModule),
  },
  {
    componentId: 'substance-polymer-structure',
    path: 'substance-polymer-structure',
    loadChildren: () => import('./substance-details/substance-polymer-structure/substance-polymer-structure.module').then(m => m.SubstancePolymerStructureModule),
  },
  {
    componentId: 'substance-monomers',
    path: 'substance-monomers',
    loadChildren: () => import('./substance-details/substance-monomers/substance-monomers.module').then(m => m.SubstanceMonomersModule),
  },
  {
    componentId: 'substance-mixture-components',
    path: 'substance-mixture-components',
    loadChildren: () => import('./substance-details/substance-mixture-components/substance-mixture-components.module').then(m => m.SubstanceMixtureComponentsModule),
  },
  {
    componentId: 'substance-modifications',
    path: 'substance-modifications',
    loadChildren: () => import('./substance-details/substance-modifications/substance-modifications.module').then(m => m.SubstanceModificationsModule),
  },
  {
    componentId: 'substance-disulfide-links',
    path: 'substance-disulfide-links',
    loadChildren: () => import('./substance-details/substance-disulfide-links/substance-disulfide-links.module').then(m => m.SubstanceDisulfideLinksModule),
  },
  {
    componentId: 'substance-other-links',
    path: 'substance-other-links',
    loadChildren: () => import('./substance-details/substance-other-links/substance-other-links.module').then(m => m.SubstanceOtherLinksModule),
  },
  {
    componentId: 'substance-glycosylation',
    path: 'substance-glycosylation',
    loadChildren: () => import('./substance-details/substance-glycosylation/substance-glycosylation.module').then(m => m.SubstanceGlycosylationModule),
  },
  {
    componentId: 'substance-na-sugars',
    path: 'substance-na-sugars',
    loadChildren: () => import('./substance-details/substance-na-sugars/substance-na-sugars.module').then(m => m.SubstanceNaSugarsModule),
  },
  {
    componentId: 'substance-na-linkages',
    path: 'substance-na-linkages',
    loadChildren: () => import('./substance-details/substance-na-linkages/substance-na-linkages.module').then(m => m.SubstanceNaLinkagesModule),
  },
  {
    componentId: 'substance-properties',
    path: 'substance-properties',
    loadChildren: () => import('./substance-details/substance-properties/substance-properties.module').then(m => m.SubstancePropertiesModule),
  },
  {
    componentId: 'substance-primary-definition',
    path: 'substance-primary-definition',
    loadChildren: () => import('./substance-details/substance-primary-definition/substance-primary-definition.module').then(m => m.SubstancePrimaryDefinitionModule),
  },
  {
    componentId: 'substance-variant-concepts',
    path: 'substance-variant-concepts',
    loadChildren: () => import('./substance-details/substance-variant-concepts/substance-variant-concepts.module').then(m => m.SubstanceVariantConceptsModule),
  },
  {
    componentId: 'substance-mixture-source',
    path: 'substance-mixture-source',
    loadChildren: () => import('./substance-details/substance-mixture-source/substance-mixture-source.module').then(m => m.SubstanceMixtureSourceModule),
  },
  {
    componentId: 'substance-history',
    path: 'substance-history',
    loadChildren: () => import('./substance-details/substance-history/substance-history.module').then(m => m.SubstanceHistoryModule),
  },
  {
    componentId: 'substance-form-definition',
    path: 'substance-form-definition',
    loadChildren: () => import('./substance-form/substance-form-definition/substance-form-definition.module').then(m => m.SubstanceFormDefinitionModule),
  },
  {
    componentId: 'substance-form-references',
    path: 'substance-form-references',
    loadChildren: () => import('./substance-form/substance-form-references/substance-form-references.module').then(m => m.SubstanceFormReferencesModule),
  },
  {
    componentId: 'substance-form-names',
    path: 'substance-form-names',
    loadChildren: () => import('./substance-form/substance-form-names/substance-form-names.module').then(m => m.SubstanceFormNamesModule),
  },
  {
    componentId: 'substance-form-structure',
    path: 'substance-form-structure',
    loadChildren: () => import('./substance-form/substance-form-structure/substance-form-structure.module').then(m => m.SubstanceFormStructureModule),
  },
  {
    componentId: 'substance-form-moieties',
    path: 'substance-form-moieties',
    loadChildren: () => import('./substance-form/substance-form-moieties/substance-form-moieties.module').then(m => m.SubstanceFormMoietiesModule),
  },
  {
    componentId: 'substance-form-codes',
    path: 'substance-form-codes',
    loadChildren: () => import('./substance-form/substance-form-codes/substance-form-codes.module').then(m => m.SubstanceFormCodesModule),
  },
  {
    componentId: 'substance-form-relationships',
    path: 'substance-form-relationships',
    loadChildren: () => import('./substance-form/substance-form-relationships/substance-form-relationships.module').then(m => m.SubstanceFormRelationshipsModule),
  },
  {
    componentId: 'substance-form-notes',
    path: 'substance-form-notes',
    loadChildren: () => import('./substance-form/substance-form-notes/substance-form-notes.module').then(m => m.SubstanceFormNotesModule),
  },
  {
    componentId: 'substance-form-properties',
    path: 'substance-form-properties',
    loadChildren: () => import('./substance-form/substance-form-properties/substance-form-properties.module').then(m => m.SubstanceFormPropertiesModule)
  }
];
