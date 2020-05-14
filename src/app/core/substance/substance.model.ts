import { StructuralUnit } from '@gsrs-core/substance/structural-unit.model';
import {MatchContext} from '@gsrs-core/utils';

export interface SubstanceBase {
  uuid?: string;
  created?: number;
  createdBy?: string;
  lastEdited?: number;
  lastEditedBy?: string;
  deprecated?: boolean;
  access?: Array<string>;

  // only to be used on client side
  // delete property before sending to server
  $$deletedCode?: string;
}

export interface SubstanceBaseExtended {
  definitionType?: string;
  definitionLevel?: string;
  substanceClass?: string;
  status?: string;
  version?: string;
  approved?: string;
  approvedBy?: string;
  approvalID?: string;
  structurallyDiverse?: StructurallyDiverse;
  structure?: SubstanceStructure;
  polymer?: Polymer;
  moieties?: Array<SubstanceMoiety>;
  _approvalIDDisplay?: string;
  _name?: string;
  _self?: string;
  nucleicAcid?: NucleicAcid;
  changeReason?: string;
  protein?: Protein;
}

export interface SubstanceSummary extends SubstanceBase, SubstanceBaseExtended {
  _names?: CountRef;
  _modifications?: CountRef;
  _references?: CountRef;
  _codes?: CountRef;
  _relationships?: CountRef;
  _moieties?: CountRef;
  _properties?: CountRef;
  _matchContext?: MatchContext;
}

export interface SubstanceDetail extends SubstanceBase, SubstanceBaseExtended {
  names?: Array<SubstanceName>;
  codes?: Array<SubstanceCode>;
  properties?: Array<SubstanceProperty>;
  relationships?: Array<SubstanceRelationship>;
  references?: Array<SubstanceReference>;
  notes?: Array<SubstanceNote>;
  tags?: Array<string>;
  protein?: Protein;
  mixture?: Mixture;
  polymer?: Polymer;
  modifications?: SubstanceModifications;
  specifiedSubstance?: SpecifiedSubstance;
  _matchContext?: MatchContext;
}

export interface StructurallyDiverse extends SubstanceBase {
  sourceMaterialClass?: string;
  sourceMaterialType?: string;
  sourceMaterialState?: string;
  part?: Array<string>;
  partLocation?: string;
  parentSubstance?: SubstanceRelated;
  references?: Array<string>;
  organismFamily?: string;
  organismGenus?: string;
  organismSpecies?: string;
  organismAuthor?: string;
  developmentalStage?: string;
  fractionMaterialType?: string;
  fractionName?: string;
  infraSpecificName?: string;
  infraSpecificType?: string;
  hybridSpeciesMaternalOrganism?: SubstanceRelated;
  hybridSpeciesPaternalOrganism?: SubstanceRelated;
  $$diverseType?: string;
  $$storedPart?: Array<string>;

}

export interface Polymer extends SubstanceBase {
  uuid?: string;
  references?: Array<string>;
  displayStructure?: DisplayStructure;
  idealizedStructure?: SubstanceStructure;
  monomers?: Array<Monomer>;
  classification?: PolymerClassification;
  structuralUnits?: Array<StructuralUnit>;
}

export interface SpecifiedSubstance extends SubstanceBase {
  uuid?: string;
  references?: Array<string>;
  constituents?: Array<Constituent>;
}

export interface PolymerClassification extends SubstanceBase {
  uuid?: string;
  references?: Array<string>;
  polymerClass?: string;
  polymerGeometry?: string;
  polymerSubClass?: Array<string>;
  parentSubstance?: SubstanceRelated;
  access?: Array<string>;
  sourceType?: string;
}

export interface Constituent extends SpecifiedSubstance {
  role?: string;
  amount?: SubstanceAmount;
  references?: Array<string>;
  substance?: SubstanceRelated;
}

export interface NucleicAcid extends SubstanceBase {
  uuid?: string;
  references?: Array<string>;
  nucleicAcidType?: string;
  nucleicAcidSubType?: Array<string>;
  sequenceOrigin?: string;
  sequenceType?: string;
  subunits?: Array<Subunit>;
  sugars?: Array<Sugar>;
  linkages?: Array<Linkage>;

}

export interface Sugar extends NucleicAcid {
  sugar?: string;
  sitesShorthand?: string;
  sites?: Array<Site>;
}

export interface Linkage extends NucleicAcid {
  linkage?: string;
  sitesShorthand?: string;
  sites?: Array<Site>;
}

export interface Mixture extends SubstanceBase {
  uuid?: string;
  components?: Array<MixtureComponents>;
  parentSubstance?: SubstanceRelated;
  references?: Array<string>;
}

export interface MixtureComponents extends Mixture {
  uuid?: string;
  type?: string;
  substance?: SubstanceRelated;
}

export interface DisplayStructure extends Polymer {
  id?: string;
  smiles?: string;
}

export interface Monomer extends Polymer {
  uuid?: string;
  type?: string;
  defining?: boolean;
  amount?: SubstanceAmount;
  monomerSubstance?: SubstanceRelated;
}

export interface SubstanceRelated extends SubstanceBase {
  refPname?: string;
  refuuid?: string;
  substanceClass?: string;
  approvalID?: string;
  linkingID?: string;
  name?: string;
  references?: Array<string>;
  $$bdnum?: string;
}

export interface CountRef {
  count?: number;
  href?: string;
}

export interface SubstanceName extends SubstanceBase {
  name?: string;
  type?: string;
  domains?: Array<string>;
  languages?: Array<string>;
  nameJurisdiction?: Array<string>;
  nameOrgs?: Array<string | SubstanceNameOrg>;
  preferred?: boolean;
  displayName?: boolean;
  references?: Array<string>;
  _self?: string;
}

export interface SubstanceCode extends SubstanceBase {
  codeSystem?: string;
  code?: string;
  comments?: string;
  type?: string;
  url?: string;
  references?: Array<string>;
  _self?: string;
}

export interface SubstanceNote extends SubstanceBase {
  note?: string;
  references?: Array<string>;
}

export interface SubstanceProperty extends SubstanceBase {
  name?: string;
  type?: string;
  propertyType?: string;
  value?: SubstanceAmount;
  defining?: boolean;
  parameters?: Array<SubstanceParameter>;
  referencedSubstance?: SubstanceReference;
  references?: Array<SubstanceReference>;
}

export interface SubstanceParameter extends SubstanceBase {
  name?: string;
  type?: string;
  references?: Array<string>;
  value?: SubstanceAmount;
}

export interface SubstanceRelationship extends SubstanceBase {
  comments?: string;
  interactionType?: string;
  qualification?: string;
  relatedSubstance?: SubstanceRelated;
  originatorUuid?: string;
  type?: string;
  references?: Array<string>;
  amount?: SubstanceAmount;
  mediatorSubstance?: MediatorSubstance;
}

export interface SubstanceAmount extends SubstanceBase {
  units?: string;
  type?: string;
  average?: number;
  references?: Array<string>;
  highLimit?: number;
  lowLimit?: number;
  nonNumericValue?: string;
  low?: number;
  high?: number;
}

export interface SubstanceReference extends SubstanceBase {
  id?: string;
  citation?: string;
  docType?: string;
  publicDomain?: boolean;
  tags?: Array<string>;
  url?: string;
  _self?: string;
  documentDate?: number;
  refuuid?: string;
  uploadedFile?: string;
}

export interface MediatorSubstance extends SubstanceBase {
  refPname?: string;
  refuuid?: string;
  substanceClass?: string;
  approvalID?: string;
  linkingID?: string;
  name?: string;
  references?: Array<string>;
}

export interface SubstanceModifications extends SubstanceBase {
  uuid?: string;
  structuralModifications?: Array<StructuralModification>;
  physicalModifications?: Array<PhysicalModification>;
  agentModifications?: Array<AgentModification>;
}

export interface StructuralModification extends SubstanceModifications {
  structuralModificationType?: string;
  locationType?: string;
  residueModified?: string;
  $$residueModified?: any;
  sites?: Array<Site>;
  extent?: string;
  extentAmount?: SubstanceAmount;
  molecularFragment?: SubstanceRelated;
  modificationGroup?: string;
  comment?: string;
  references?: Array<string>;
}

export interface PhysicalModification extends SubstanceModifications {
  physicalModificationRole?: string;
  parameters?: Array<PhysicalModificationParameter>;
  modificationGroup?: string;
}

export interface PhysicalModificationParameter extends PhysicalModification {
  parameterName?: string;
  references?: Array<string>;
  amount?: SubstanceAmount;
}

export interface AgentModification extends SubstanceModifications {
  agentModificationProcess?: string;
  agentModificationRole?: string;
  agentModificationType?: string;
  amount?: SubstanceAmount;
  agentSubstance?: SubstanceRelated;
  modificationGroup?: string;
}

export interface ModificationSite extends StructuralModification {
  subunitIndex: string;
  residueIndex: string;
}

export interface SubstanceStructure extends SubstanceBase {
  id?: string;
  digest?: string;
  molfile?: string;
  smiles?: string;
  formula?: string;
  opticalActivity?: string;
  atropisomerism?: string;
  stereoCenters?: number;
  definedStereo?: number;
  ezCenters?: number;
  charge?: number;
  mwt?: number;
  count?: number;
  hash?: string;
  _self?: string;
  self?: string;
  stereochemistry?: string;
  references?: Array<string>;
  _properties?: CountRef;
  stereoComments?: string;
}

export interface SubstanceMoiety extends SubstanceStructure {
  countAmount?: SubstanceAmount;
}

export interface SubstanceNameOrg extends SubstanceBase {
  nameOrg?: string;
  references?: Array<string>;
}

export interface Protein extends SubstanceBase {
  proteinType?: string;
  proteinSubType?: string;
  sequenceOrigin?: string;
  sequenceType?: string;
  glycosylation?: Glycosylation;
  subunits?: Array<Subunit>;
  otherLinks?: Array<Link>;
  disulfideLinks?: Array<DisulfideLink>;
  references?: Array<string>;
  _disulfideLinks?: any;
  _glycosylation?: any;
}

export interface Glycosylation extends SubstanceBase {
  glycosylationType?: string;
  CGlycosylationSites?: Array<Site>;
  NGlycosylationSites?: Array<Site>;
  OGlycosylationSites?: Array<Site>;
  references?: Array<string>;
}

export interface Subunit extends SubstanceBase {
  sequence?: string;
  subunitIndex?: number;
  length?: number;
  references?: Array<string>;
}

export interface Link extends SubstanceBase {
  linkageType?: string;
  sites?: Array<Site>;
  references?: Array<string>;
}

export interface DisulfideLink extends SubstanceBase {
  sites?: Array<Site>;
  sitesShorthand?: string;
}

export interface Site {
  subunitIndex?: number;
  residueIndex?: number;
}

export interface SubstanceEdit {
  editor: string;
  version: string;
  oldValue: string;
  refid: string;
  created: number;
  comments?: string;
}

export interface ProteinFeatures {
  features: Array<Feature>;
}

export interface Feature {
  sites?: Array<Site>;
  siteRange?: string;
  name?: string;
}
