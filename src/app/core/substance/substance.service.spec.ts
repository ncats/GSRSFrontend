import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { SubstanceService } from './substance.service';
import { SubstanceDetailsListData } from '../../../testing/substance-details-list-test-data';
import { SubstanceSummary, SubstanceDetail } from './substance.model';
import { PagingResponse } from '../utils/paging-response.model';
import { SubstanceSummaryListData } from '../../../testing/substance-summary-list-test-data';
import { Observable } from 'rxjs';
import { StructureSearchResponseTestData } from '../../../testing/structure-search-response-test-data';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilsService } from '../utils/utils.service';
import { FacetParam } from '@gsrs-core/facets-manager';
import { AuthService } from '@gsrs-core/auth/auth.service';

describe('SubstanceService', () => {

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let configService: ConfigService;
  let substanceService: SubstanceService;
  let expectedSubstanceDetails: PagingResponse<SubstanceDetail>;
  let expectedSubstanceSummaries: PagingResponse<SubstanceSummary>;
  let domSanitizer: DomSanitizer;
  let utilsService: UtilsService;

  beforeEach(() => {

    expectedSubstanceDetails = SubstanceDetailsListData;
    expectedSubstanceSummaries = SubstanceSummaryListData;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    domSanitizer = TestBed.inject(DomSanitizer);
    configService = new ConfigService(httpClient);
    configService.configData = { apiBaseUrl: '', services: [], privacyStatement: '' };
    utilsService = new UtilsService(httpClient, configService, domSanitizer);
    substanceService = new SubstanceService(httpClient, {} as AuthService, configService, domSanitizer, utilsService);
  });

  it('should be created', () => {
    expect(substanceService).toBeTruthy();
  });

  describe('getSubtanceDetails', () => {
    let httpClientGetSpy: jasmine.Spy;
    let facets: FacetParam;

    beforeEach(() => {
      httpClientGetSpy = spyOn(httpClient, 'get');
      httpClientGetSpy.and.callThrough();

      facets = {
        'Code System': {
          isAllMatch: false,
          params: {
            'PUBCHEM': true,
            'MERCK INDEX': null
          }
        },
        'Reference Type': undefined,
        'Validation': {
          isAllMatch: false,
          params: {
            'Code Collision': true
          }
        }
      };
    });

    it('should add view=full as query param and return expected substance details', () => {
      substanceService.getSubstancesSummaries().subscribe(
        substances => {
          expect(substances).toEqual(expectedSubstanceDetails, 'should return expected subtances');
        },
        fail
      );

      expect(httpClientGetSpy.calls.mostRecent().args[1].params.get('view')).toEqual('full');
    });

    it('if facets param not null & not a structure serach, facets set to true should be added to params', () => {

      substanceService.getSubstancesSummaries({ facets: facets }).subscribe();
      substanceService.getSubstancesSummaries({ searchTerm: 'test', facets: facets }).subscribe();
      substanceService.getSubstancesSummaries({ pageSize: 15, facets: facets, skip: 1 }).subscribe();

      httpClientGetSpy.calls.all().forEach(call => {
        expect(call.args[1].params.getAll('facet'))
          .toEqual(['Code System/PUBCHEM', 'Validation/Code Collision']);
      });

    });

    it('if searchTerm passed, q must be added as query param to http call', () => {
      const searchTerm = 'test search term';

      substanceService.getSubstancesSummaries({ searchTerm: searchTerm }).subscribe();
      substanceService.getSubstancesSummaries({ searchTerm: searchTerm, type: 'test' }).subscribe();
      substanceService.getSubstancesSummaries({ searchTerm: searchTerm, cutoff: 0.5 }).subscribe();
      substanceService.getSubstancesSummaries({ searchTerm: searchTerm, pageSize: 100 }).subscribe();
      substanceService.getSubstancesSummaries({ searchTerm: searchTerm, facets: facets }).subscribe();
      substanceService.getSubstancesSummaries({ searchTerm: searchTerm, skip: 10 }).subscribe();

      httpClientGetSpy.calls.all().forEach(call => {
        expect(call.args[1].params.get('q'))
          .toEqual(searchTerm);
      });
    });

    it('if not structure search, when pageSize and skip passed as parameters,' +
      'top and skip should be passed as query parameters respectively', () => {
        const pageSize = 50;
        const skip = 150;

        substanceService.getSubstancesSummaries({ searchTerm: 'test', pageSize: pageSize, skip: skip }).subscribe();
        substanceService.getSubstancesSummaries({ type: 'test', pageSize: pageSize, skip: skip }).subscribe();
        substanceService.getSubstancesSummaries({ cutoff: 0.5, pageSize: pageSize, skip: skip }).subscribe();
        substanceService.getSubstancesSummaries({ pageSize: pageSize, skip: skip }).subscribe();
        substanceService.getSubstancesSummaries({ pageSize: pageSize, skip: skip }).subscribe();
        substanceService.getSubstancesSummaries({ pageSize: pageSize, skip: skip }).subscribe();
        substanceService.getSubstancesSummaries({ pageSize: pageSize, facets: facets, skip: skip }).subscribe();
        substanceService.getSubstancesSummaries({ pageSize: pageSize, skip: skip }).subscribe();

        httpClientGetSpy.calls.all().forEach(call => {
          expect(call.args[1].params.get('top'))
            .toEqual(pageSize.toString());
          expect(call.args[1].params.get('skip'))
            .toEqual(skip.toString());
        });
      });

    describe('structure search', () => {
      let structureSearchTerm: string;

      beforeEach(() => {
        structureSearchTerm = 'testStrutctureSearchTermId';
      });

      it('on initial search, call should be made to corrent url and with correct parameters', () => {

        substanceService.getSubstancesSummaries({ structureSearchTerm: structureSearchTerm }).subscribe();
        substanceService.getSubstancesSummaries({ structureSearchTerm: structureSearchTerm, type: 'test' }).subscribe();
        substanceService.getSubstancesSummaries({ structureSearchTerm: structureSearchTerm, cutoff: 0.5 }).subscribe();
        substanceService.getSubstancesSummaries({ structureSearchTerm: structureSearchTerm, pageSize: 100 }).subscribe();
        substanceService.getSubstancesSummaries({ structureSearchTerm: structureSearchTerm, facets: facets }).subscribe();
        substanceService.getSubstancesSummaries({ structureSearchTerm: structureSearchTerm, skip: 10 }).subscribe();

        httpClientGetSpy.calls.all().forEach(call => {
          expect(call.args[0])
            .toEqual('api/v1/substances/structureSearch');
          expect(call.args[1].params.get('q'))
            .toEqual(structureSearchTerm);
        });

      });

      it('first structure search should to go url to get url with results, ' +
        'then immediately make a call to get results. ' +
        'Another call to search the same structure should go straight to get results', waitForAsync(() => {

          const responseComplete = new Observable(observer => {
            setTimeout(() => {
              observer.next(StructureSearchResponseTestData);
              observer.complete();
            });
          });

          httpClientGetSpy.and.returnValue(responseComplete);

          substanceService.getSubstancesSummaries({ structureSearchTerm: structureSearchTerm })
            .subscribe(response => {
              const expectedUrl = `api/v1/status(${StructureSearchResponseTestData.key})/results`;

              substanceService.getSubstancesSummaries({ structureSearchTerm: structureSearchTerm })
                .subscribe(_response => {
                  const allCalls = httpClientGetSpy.calls.all();
                  expect(allCalls[0].args[0]).toEqual('api/v1/substances/structureSearch');
                  expect(allCalls[1].args[0]).toEqual(expectedUrl);
                  expect(allCalls[2].args[0]).toEqual(expectedUrl);
                });
            });

        }));

    });

  });

  it('should return expected substance summaries (called once)', () => {

    substanceService.getSubstancesSummaries().subscribe(
      substances => expect(substances).toEqual(expectedSubstanceSummaries, 'should return expected subtances'),
      fail
    );
  });
});
