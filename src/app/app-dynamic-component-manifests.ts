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
    }
];
