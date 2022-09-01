
export interface Ssg4mSyntheticPathway {
  createdBy?: string;
  modifiedBy?: string;
  creationDate?: number;
  lastModifiedDate?: number;
  synthPathwaySkey?: number;
  synthPathwayId?: string;
  versionNumber?: number;
  appCenterCd?: string;
  appType?: string;
  appNumber?: number;
  versionType?: string;
  versionStatusCd?: string;
  sbmsnDataText?: string;
  printSbstncUuid?: string;
  printSbstncPrfrdNm?: string;
  sbmsnImage?: string;
  ssg4mSyntheticPathwayDetailsList?: Array<Ssg4mSyntheticPathwayDetail>;
}

export interface Ssg4mSyntheticPathwayDetail {
  createdBy?: string;
  modifiedBy?: string;
  creationDate?: number;
  lastModifiedDate?: number;
  synthPathwayDetailSkey?: number;
  sbstncUuid?: string;
  sbstncPfrdNm?: string;
  sbstncReactnSectNm?: string;
  sbstncRoleNm?: string;
}

