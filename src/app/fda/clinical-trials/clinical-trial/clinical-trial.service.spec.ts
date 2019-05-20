import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { ClinicalTrialDrugService } from './clinical-trial-drug.service';
import { ClinicalTrialDrugListData } from '../../testing/clinical-trial-drug-list-test-data';
import { ClinicalTrialDrug } from './clinical-trial.model';
import { PagingResponse } from '../utils/paging-response.model';

describe('ClinicalTrialDrugService', () => {

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let configService: ConfigService;
  let clinicalTrialDrugService: ClinicalTrialDrugService;
  let expectedClinicalTrialDrugs: PagingResponse<ClinicalTrialDrug>;

  beforeEach(() => {
    expectedClinicalTrialDrugs = clinicalTrialDrugListData;

    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    configService = new ConfigService(httpClient);
    configService.configData = { apiBaseUrl: '' };
    clinicalTrialDrugService = new ClinicalTrialDrugService(httpClient, configService);
  });

  it('should be created', () => {
    expect(clinicalTrialDrugService).toBeTruthy();
  });

  it('should return expected clincal trial drugs (called once)', () => {
    clinicalTrialDrugService.getSubtanceDetails().subscribe(
      drugs => expect(drugs).toEqual(expectedClinicalTrialDrugs, 'should return expected drugs'),
      fail
    );
  });
});
