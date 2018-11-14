import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { SubstanceService } from './substance.service';
import { SubstanceDetailsListData } from '../../testing/substance-details-list-test-data';
import { SubstanceSummary, SubstanceDetail } from './substance.model';
import { PagingResponse } from '../utils/paging-response.model';
import { SubstanceSummaryListData } from '../../testing/substance-summary-list-test-data';

describe('SubstanceService', () => {

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let configService: ConfigService;
  let substanceService: SubstanceService;
  let expectedSubstanceDetails: PagingResponse<SubstanceDetail>;
  let expectedSubstanceSummaries: PagingResponse<SubstanceSummary>;

  beforeEach(() => {
    expectedSubstanceDetails = SubstanceDetailsListData;

    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    configService = new ConfigService(httpClient);
    configService.configData = { apiBaseUrl: '' };
    substanceService = new SubstanceService(httpClient, configService);
  });

  it('should be created', () => {
    expect(substanceService).toBeTruthy();
  });

  it('should return expected substance details (called once)', () => {

    substanceService.getSubtanceDetails().subscribe(
      substances => expect(substances).toEqual(expectedSubstanceDetails, 'should return expected subtances'),
      fail
    );
  });

  it('should return expected substance summaries (called once)', () => {

    substanceService.getSubstanceSummaries().subscribe(
      substances => expect(substances).toEqual(expectedSubstanceSummaries, 'should return expected subtances'),
      fail
    );
  });
});
