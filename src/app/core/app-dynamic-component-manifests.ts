import {
  LazyLoadedComponentManifest
} from './dynamic-component-loader/dynamic-component-manifest';

export const dynamicComponentManifests: LazyLoadedComponentManifest[] = [
  {
    componentId: 'structure-details',
    path: 'structure-details',
    loadChildren: () => import('./substance-details/structure-details/structure-details.module')
      .then(m => m.StructureDetailsModule),
  },
  {
    componentId: 'substance-audit-info',
    path: 'substance-audit-info',
    loadChildren: () => import('./substance-details/substance-audit-info/substance-audit-info.module')
      .then(m => m.SubstanceAuditInfoModule),
  },
  {
    componentId: 'substance-codes',
    path: 'substance-codes',
    loadChildren: () => import('./substance-details/substance-codes/substance-codes.module')
      .then(m => m.SubstanceCodesModule),
  },
  {
    componentId: 'substance-subunits',
    path: 'substance-subunits',
    loadChildren: () => import('./substance-details/substance-subunits/substance-subunits.module')
      .then(m => m.SubstanceSubunitsModule),
  },
  {
    componentId: 'substance-moieties',
    path: 'substance-moieties',
    loadChildren: () => import('./substance-details/substance-moieties/substance-moieties.module')
      .then(m => m.SubstanceMoietiesModule),
  },
  {
    componentId: 'substance-names',
    path: 'substance-names',
    loadChildren: () => import('./substance-details/substance-names/substance-names.module')
      .then(m => m.SubstanceNamesModule),
  },
  {
    componentId: 'substance-notes',
    path: 'substance-notes',
    loadChildren: () => import('./substance-details/substance-notes/substance-notes.module')
      .then(m => m.SubstanceNotesModule),
  },
  {
    componentId: 'substance-overview',
    path: 'substance-overview',
    loadChildren: () => import('./substance-details/substance-overview/substance-overview.module')
      .then(m => m.SubstanceOverviewModule),
  },
  {
    componentId: 'substance-references',
    path: 'substance-references',
    loadChildren: () => import('./substance-details/substance-references/substance-references.module')
      .then(m => m.SubstanceReferencesModule),
  },
  {
    componentId: 'substance-relationships-visualization',
    path: 'substance-relationships-visualization',
    loadChildren: () => import('./substance-details/substance-relationships-visualization/substance-relationships-visualization.module')
      .then(m => m.SubstanceRelationshipsVisualizationModule),
  },
  {
    componentId: 'substance-relationships',
    path: 'substance-relationships',
    loadChildren: () => import('./substance-details/substance-relationships/substance-relationships.module')
      .then(m => m.SubstanceRelationshipsModule),
  },
  {
    componentId: 'substance-concept-definition',
    path: 'substance-concept-definition',
    loadChildren: () => import('./substance-details/substance-concept-definition/substance-concept-definition.module')
      .then(m => m.SubstanceConceptDefinitionModule),
  },
  {
    componentId: 'substance-polymer-structure',
    path: 'substance-polymer-structure',
    loadChildren: () => import('./substance-details/substance-polymer-structure/substance-polymer-structure.module')
      .then(m => m.SubstancePolymerStructureModule),
  },
  {
    componentId: 'substance-monomers',
    path: 'substance-monomers',
    loadChildren: () => import('./substance-details/substance-monomers/substance-monomers.module')
      .then(m => m.SubstanceMonomersModule),
  },
  {
    componentId: 'substance-structural-units',
    path: 'substance-structural-units',
    loadChildren: () => import('./substance-details/substance-structural-units/substance-structural-units.module')
      .then(m => m.SubstanceStructuralUnitsModule),
  },
  {
    componentId: 'substance-mixture-components',
    path: 'substance-mixture-components',
    loadChildren: () => import('./substance-details/substance-mixture-components/substance-mixture-components.module')
      .then(m => m.SubstanceMixtureComponentsModule),
  },
  {
    componentId: 'substance-modifications',
    path: 'substance-modifications',
    loadChildren: () => import('./substance-details/substance-modifications/substance-modifications.module')
      .then(m => m.SubstanceModificationsModule),
  },
  {
    componentId: 'substance-disulfide-links',
    path: 'substance-disulfide-links',
    loadChildren: () => import('./substance-details/substance-disulfide-links/substance-disulfide-links.module')
      .then(m => m.SubstanceDisulfideLinksModule),
  },
  {
    componentId: 'substance-other-links',
    path: 'substance-other-links',
    loadChildren: () => import('./substance-details/substance-other-links/substance-other-links.module')
      .then(m => m.SubstanceOtherLinksModule),
  },
  {
    componentId: 'substance-glycosylation',
    path: 'substance-glycosylation',
    loadChildren: () => import('./substance-details/substance-glycosylation/substance-glycosylation.module')
      .then(m => m.SubstanceGlycosylationModule),
  },
  {
    componentId: 'substance-na-sugars',
    path: 'substance-na-sugars',
    loadChildren: () => import('./substance-details/substance-na-sugars/substance-na-sugars.module')
      .then(m => m.SubstanceNaSugarsModule),
  },
  {
    componentId: 'substance-na-linkages',
    path: 'substance-na-linkages',
    loadChildren: () => import('./substance-details/substance-na-linkages/substance-na-linkages.module')
      .then(m => m.SubstanceNaLinkagesModule),
  },
  {
    componentId: 'substance-properties',
    path: 'substance-properties',
    loadChildren: () => import('./substance-details/substance-properties/substance-properties.module')
      .then(m => m.SubstancePropertiesModule),
  },
  {
    componentId: 'substance-constituents',
    path: 'substance-constituents',
    loadChildren: () => import('./substance-details/substance-constituents/substance-constituents.module')
      .then(m => m.SubstanceConstituentsModule),
  },
  {
    componentId: 'substance-primary-definition',
    path: 'substance-primary-definition',
    loadChildren: () => import('./substance-details/substance-primary-definition/substance-primary-definition.module')
      .then(m => m.SubstancePrimaryDefinitionModule),
  },
  {
    componentId: 'substance-alternative-definition',
    path: 'substance-alternative-definition',
    loadChildren: () => import('./substance-details/substance-alternative-definition/substance-alternative-definition.module')
      .then(m => m.SubstanceAlternativeDefinitionModule),
  },
  {
    componentId: 'substance-variant-concepts',
    path: 'substance-variant-concepts',
    loadChildren: () => import('./substance-details/substance-variant-concepts/substance-variant-concepts.module')
      .then(m => m.SubstanceVariantConceptsModule),
  },
  {
    componentId: 'substance-mixture-source',
    path: 'substance-mixture-source',
    loadChildren: () => import('./substance-details/substance-mixture-source/substance-mixture-source.module')
      .then(m => m.SubstanceMixtureSourceModule),
  },
  {
    componentId: 'substance-mixture-parent',
    path: 'substance-mixture-parent',
    loadChildren: () => import('./substance-details/substance-mixture-parent/substance-mixture-parent.module')
      .then(m => m.SubstanceMixtureParentModule),
  },
  {
    componentId: 'substance-hierarchy',
    path: 'substance-hierarchy',
    loadChildren: () => import('./substance-details/substance-hierarchy/substance-hierarchy.module')
      .then(m => m.SubstanceHierarchyModule),
  },
  {
    componentId: 'substance-history',
    path: 'substance-history',
    loadChildren: () => import('./substance-details/substance-history/substance-history.module')
      .then(m => m.SubstanceHistoryModule),
  },
  {
    componentId: 'substance-ssg-parent-substance',
    path: 'substance-ssg-parent-substance',
    loadChildren: () => import('./substance-details/substance-ssg-parent-substance/substance-ssg-parent-substance.module')
      .then(m => m.SubstanceSsgParentSubstanceModule),
  },
  {
    componentId: 'substance-ssg1-parent',
    path: 'substance-ssg1-parent',
    loadChildren: () => import('./substance-details/substance-ssg1-parent/substance-ssg1-parent.module')
      .then(m => m.SubstanceSsg1ParentModule),
  },
  {
    componentId: 'substance-ssg-grade',
    path: 'substance-ssg-grade',
    loadChildren: () => import('./substance-details/substance-ssg-grade/substance-ssg-grade.module')
      .then(m => m.SubstanceSsgGradeModule),
  },
  {
    componentId: 'substance-ssg-definition',
    path: 'substance-ssg-definition',
    loadChildren: () => import('./substance-details/substance-ssg-definition/substance-ssg-definition.module')
      .then(m => m.SubstanceSsgDefinitionModule),
  },
  {
    componentId: 'substance-form-definition',
    path: 'substance-form-definition',
    loadChildren: () => import('./substance-form/substance-form-definition/substance-form-definition.module')
      .then(m => m.SubstanceFormDefinitionModule),
  },
  {
    componentId: 'substance-form-references',
    path: 'substance-form-references',
    loadChildren: () => import('./substance-form/references/substance-form-references.module')
      .then(m => m.SubstanceFormReferencesModule),
  },
  {
    componentId: 'substance-form-names',
    path: 'substance-form-names',
    loadChildren: () => import('./substance-form/names/substance-form-names.module')
      .then(m => m.SubstanceFormNamesModule),
  },
  {
    componentId: 'substance-form-structure',
    path: 'substance-form-structure',
    loadChildren: () => import('./substance-form/structure/substance-form-structure.module')
      .then(m => m.SubstanceFormStructureModule),
  },
  {
    componentId: 'substance-form-moieties',
    path: 'substance-form-moieties',
    loadChildren: () => import('./substance-form/moieties/substance-form-moieties.module')
      .then(m => m.SubstanceFormMoietiesModule),
  },
  {
    componentId: 'substance-form-codes-card',
    path: 'substance-form-codes-card',
    loadChildren: () => import('./substance-form/codes/substance-form-codes.module')
      .then(m => m.SubstanceFormCodesModule),
  },
  {
    componentId: 'substance-form-relationships',
    path: 'substance-form-relationships',
    loadChildren: () => import('./substance-form/relationships/substance-form-relationships.module')
      .then(m => m.SubstanceFormRelationshipsModule),
  },
  {
    componentId: 'substance-form-notes',
    path: 'substance-form-notes',
    loadChildren: () => import('./substance-form/notes/substance-form-notes.module')
      .then(m => m.SubstanceFormNotesModule),
  },
  {
    componentId: 'substance-form-properties',
    path: 'substance-form-properties',
    loadChildren: () => import('./substance-form/properties/substance-form-properties.module')
      .then(m => m.SubstanceFormPropertiesModule)
  },
  {
    componentId: 'substance-form-subunits',
    path: 'substance-form-subunits',
    loadChildren: () => import('./substance-form/substance-form-subunits/substance-form-subunits.module')
      .then(m => m.SubstanceFormSubunitsModule)
  },
  {
    componentId: 'substance-form-other-links',
    path: 'substance-form-other-links',
    loadChildren: () => import('./substance-form/other-links/substance-form-other-links.module')
      .then(m => m.SubstanceFormOtherLinksModule)
  },
  {
    componentId: 'substance-form-disulfide-links',
    path: 'substance-form-disulfide-links',
    loadChildren: () => import('./substance-form/disulfide-links/substance-form-disulfide-links.module')
      .then(m => m.SubstanceFormDisulfideLinksModule)
  },
  {
    componentId: 'substance-form-glycosylation',
    path: 'substance-form-glycosylation',
    loadChildren: () => import('./substance-form/glycosylation/substance-form-glycosylation.module')
      .then(m => m.SubstanceFormGlycosylationModule)
  },
  {
    componentId: 'substance-form-structural-modifications',
    path: 'substance-form-structural-modifications',
    loadChildren: () => import('./substance-form/structural-modifications/substance-form-structural-modifications.module')
      .then(m => m.SubstanceFormStructuralModificationsModule)
  },
  {
    componentId: 'substance-form-agent-modifications-card',
    path: 'substance-form-agent-modifications-card',
    loadChildren: () => import('./substance-form/agent-modifications/substance-form-agent-modifications.module')
      .then(m => m.SubstanceFormAgentModificationsModule)
  },
  {
    componentId: 'substance-form-physical-modifications',
    path: 'substance-form-physical-modifications',
    loadChildren: () => import('./substance-form/physical-modifications/substance-form-physical-modifications.module')
      .then(m => m.SubstanceFormPhysicalModificationsModule)
  },
  {
    componentId: 'substance-form-protein-details',
    path: 'substance-form-protein-details',
    loadChildren: () => import('./substance-form/protein-details/substance-form-protein-details.module')
      .then(m => m.SubstanceFormProteinDetailsModule)
  },
  {
    componentId: 'nucleic-acid-details-form',
    path: 'nucleic-acid-details-form',
    loadChildren: () => import('./substance-form/nucleic-acid-details-form/nucleic-acid-details-form.module')
      .then(m => m.NucleicAcidDetailsFormModule)
  },
  {
    componentId: 'substance-form-links',
    path: 'substance-form-links',
    loadChildren: () => import('./substance-form/links/substance-form-links.module')
      .then(m => m.SubstanceFormLinksModule)
  },
  {
    componentId: 'substance-form-sugars',
    path: 'substance-form-sugars',
    loadChildren: () => import('./substance-form/substance-form-sugars/substance-form-sugars.module')
      .then(m => m.SubstanceFormSugarsModule)
  },
  {
    componentId: 'substance-form-mixture-details',
    path: 'substance-form-mixture-details',
    loadChildren: () => import('./substance-form/mixture-details/substance-form-mixture-details.module')
      .then(m => m.SubstanceFormMixtureDetailsModule)
  },
  {
    componentId: 'substance-form-mixture-components',
    path: 'substance-form-mixture-components',
    loadChildren: () => import('./substance-form/mixture-components/substance-form-mixture-components.module')
      .then(m => m.SubstanceFormMixtureComponentsModule)
  },
  {
    componentId: 'substance-form-structurally-diverse-source',
    path: 'substance-form-structurally-diverse-source',
    loadChildren: () =>
    import('./substance-form/structurally-diverse/substance-form-structurally-diverse-source/substance-form-structurally-diverse-source.module')
      .then(m => m.SubstanceFormStructurallyDiverseSourceModule)
  },
  {
    componentId: 'substance-form-structurally-diverse-organism',
    path: 'substance-form-structurally-diverse-organism',
    loadChildren: () =>
    import('./substance-form/structurally-diverse/substance-form-structurally-diverse-organism/substance-form-structurally-diverse-organism.module')
      .then(m => m.SubstanceFormStructurallyDiverseOrganismModule)
  },
  {
    componentId: 'substance-form-constituents',
    path: 'substance-form-constituents',
    loadChildren: () => import('./substance-form/constituents/substance-form-constituents.module')
      .then(m => m.SubstanceFormConstituentsModule)
  },
  {
    componentId: 'substance-form-polymer-classification',
    path: 'substance-form-polymer-classification',
    loadChildren: () => import('./substance-form/polymer-classification/substance-form-polymer-classification.module')
      .then(m => m.SubstanceFormPolymerClassificationModule)
  },
  {
    componentId: 'substance-form-monomers',
    path: 'substance-form-monomers',
    loadChildren: () => import('./substance-form/monomers/substance-form-monomers.module')
      .then(m => m.SubstanceFormMonomersModule)
  },
  {
    componentId: 'substance-form-structural-units',
    path: 'substance-form-structural-units',
    loadChildren: () => import('./substance-form/structural-units/substance-form-structural-units.module')
      .then(m => m.SubstanceFormStructuralUnitsModule)
  },
  {
    componentId: 'substance-form-change-reason',
    path: 'substance-form-change-reason',
    loadChildren: () => import('./substance-form/substance-form-change-reason/substance-form-change-reason.module')
      .then(m => m.SubstanceFormChangeReasonModule),
  },
  {
    componentId: 'substance-form-ssg-parent-substance',
    path: 'ssg-parent-substance-form',
    loadChildren: () => import('./substance-form/ssg-parent-substance-form/ssg-parent-substance-form.module')
      .then(m => m.SsgParentSubstanceFormModule)
  },
  {
    componentId: 'substance-form-ssg-grade',
    path: 'ssg-grade-form',
    loadChildren: () => import('./substance-form/ssg-grade-form/ssg-grade-form.module')
      .then(m => m.SsgGradeFormModule)
  },
  {
    componentId: 'substance-form-ssg-definition',
    path: 'ssg-definition-form',
    loadChildren: () => import('./substance-form/ssg-definition-form/ssg-definition-form.module')
      .then(m => m.SsgDefinitionFormModule)
  }
];
