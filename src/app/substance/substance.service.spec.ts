import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClient, HttpParams } from '@angular/common/http';
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
    expectedSubstanceSummaries = SubstanceSummaryListData;

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

  describe('getSubtanceDetails', () => {
    let httpClientGetSpy: jasmine.Spy;
    let facets: {
      [facetName: string]: {
        [facetValueLabel: string]: boolean
      }
    };

    beforeEach(() => {
      httpClientGetSpy = spyOn(httpClient, 'get');
      httpClientGetSpy.and.callThrough();

      facets  = {
        'Code System': {
          'PUBCHEM': true,
          'MERCK INDEX': false
        },
        'Reference Type': undefined,
        'Validation': {
          'Code Collision': true
        }
      };
    });

    it('should add view=full as query param and return expected substance details', () => {
      substanceService.getSubtanceDetails().subscribe(
        substances => {
          expect(substances).toEqual(expectedSubstanceDetails, 'should return expected subtances');
      },
        fail
      );

      expect(httpClientGetSpy.calls.mostRecent().args[1].params.get('view')).toEqual('full');
    });

    it('if facets param not null & not a structure serach, facets set to true should be added to params', () => {

      substanceService.getSubtanceDetails(null, null, null, null, null, null, facets, null).subscribe(
        substances => {
          expect(substances).toEqual(expectedSubstanceDetails, 'should return expected subtances');
      },
        fail
      );

      substanceService.getSubtanceDetails('test', null, null, null, null, null, facets, null).subscribe(
        substances => {
          expect(substances).toEqual(expectedSubstanceDetails, 'should return expected subtances');
      },
        fail
      );

      substanceService.getSubtanceDetails(null, null, null, null, null, 15, facets, 1).subscribe(
        substances => {
          expect(substances).toEqual(expectedSubstanceDetails, 'should return expected subtances');
      },
        fail
      );

      httpClientGetSpy.calls.all().forEach(call => {
        console.log(call.args[1].params.getAll('facet'));
        expect(call.args[1].params.getAll('facet'))
          .toEqual(['Code System/PUBCHEM', 'Validation/Code Collision']);
      });

    });

  });

  it('should return expected substance summaries (called once)', () => {

    substanceService.getSubstanceSummaries().subscribe(
      substances => expect(substances).toEqual(expectedSubstanceSummaries, 'should return expected subtances'),
      fail
    );
  });
});
