export interface ProductElist {
  productId?: string;
  productNDC?: string;
  productName?: string;
  nonProprietaryName?: string;
  labelerName?: string;
  labelerDuns?: string;
  registrantDuns?: string;
  applicationNumber?: string;
  marketingCategoryCode?: string;
  marketingCategoryName?: string;
  dosageFormName?: string;
  productTypeName?: string;
  proprietaryNameSuffix?: string;
  marketingStatus?: string;
  startMarketingDate?: string;
  endMarketingDate?: string;
  isListed?: string;
  documentId?: string;
  prodActiveElistList?: Array<ProductActiveElist>;
  prodInactiveElistList?: Array<ProductInactiveElist>;
  prodRouteElistList?: Array<ProductRouteElist>;
  prodEstablishmentElistList?: Array<ProductEstablishmentElist>;
  prodCharElist?: ProductCharacterElist;
}

export interface ProductActiveElist {
  productId?: string;
  unii?: string;
  name?: string;
  activeMoietyName?: string;
  strengthNumber?: string;
  strengthNumeratorUnit?: string;
  _substanceUuid?: string;
}

export interface ProductInactiveElist {
  productId?: string;
  unii?: string;
  name?: string;
  strengthNumber?: string;
  strengthNumeratorUnit?: string;
  _substanceUuid?: string;
}

export interface ProductRouteElist {
  productId?: string;
  routeCode?: string;
  routeName?: string;
}

export interface ProductEstablishmentElist {
  id?: string;
  productId?: string;
  feiNumber?: string;
  dunsNumber?: string;
  ndcLabelerCode?: string;
  firmName?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  countryCode?: string;
}

export interface ProductCharacterElist {
  productId?: string;
  flavorName?: string;
  colorName?: string;
  shapeName?: string;
  numberOfFragments?: string;
  sizeMm?: string;
  imprintText?: string;
}

