import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, async } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { SubstanceService } from './substance.service';
import { SubstanceDetailsListData } from '../../testing/substance-details-list-test-data';
import { SubstanceSummary, SubstanceDetail } from './substance.model';
import { PagingResponse } from '../utils/paging-response.model';
import { SubstanceSummaryListData } from '../../testing/substance-summary-list-test-data';
import { Observable } from 'rxjs';
import { StructureSearchResponseTestData } from '../../testing/structure-search-response-test-data';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilsService } from '../utils/utils.service';
import { SubstanceFacetParam } from './substance-facet-param.model';

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

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    domSanitizer = TestBed.get(DomSanitizer);
    configService = new ConfigService(httpClient);
    configService.configData = { apiBaseUrl: '' };
    utilsService = new UtilsService(httpClient, configService, domSanitizer);
    substanceService = new SubstanceService(httpClient, configService, domSanitizer, utilsService);
  });

  it('should be created', () => {
    expect(substanceService).toBeTruthy();
  });

  describe('getSubtanceDetails', () => {
    let httpClientGetSpy: jasmine.Spy;
    let facets: SubstanceFacetParam;

    beforeEach(() => {
      httpClientGetSpy = spyOn(httpClient, 'get');
      httpClientGetSpy.and.callThrough();

      facets = {
        'Code System': {
          params: {
            'PUBCHEM': true,
            'MERCK INDEX': null
          }
        },
        'Reference Type': undefined,
        'Validation': {
          params: {
            'Code Collision': true
          }
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

      substanceService.getSubtanceDetails({ facets: facets }).subscribe();
      substanceService.getSubtanceDetails({ searchTerm: 'test', facets: facets }).subscribe();
      substanceService.getSubtanceDetails({ pageSize: 15, facets: facets, skip: 1 }).subscribe();

      httpClientGetSpy.calls.all().forEach(call => {
        expect(call.args[1].params.getAll('facet'))
          .toEqual(['Code System/PUBCHEM', 'Validation/Code Collision']);
      });

    });

    it('if searchTerm passed, q must be added as query param to http call', () => {
      const searchTerm = 'test search term';

      substanceService.getSubtanceDetails({ searchTerm: searchTerm }).subscribe();
      substanceService.getSubtanceDetails({ searchTerm: searchTerm, type: 'test' }).subscribe();
      substanceService.getSubtanceDetails({ searchTerm: searchTerm, cutoff: 0.5 }).subscribe();
      substanceService.getSubtanceDetails({ searchTerm: searchTerm, pageSize: 100 }).subscribe();
      substanceService.getSubtanceDetails({ searchTerm: searchTerm, facets: facets }).subscribe();
      substanceService.getSubtanceDetails({ searchTerm: searchTerm, skip: 10 }).subscribe();

      httpClientGetSpy.calls.all().forEach(call => {
        expect(call.args[1].params.get('q'))
          .toEqual(searchTerm);
      });
    });

    it('if not structure search, when pageSize and skip passed as parameters,' +
      'top and skip should be passed as query parameters respectively', () => {
        const pageSize = 50;
        const skip = 150;

        substanceService.getSubtanceDetails({ searchTerm: 'test', pageSize: pageSize, skip: skip }).subscribe();
        substanceService.getSubtanceDetails({ type: 'test', pageSize: pageSize, skip: skip }).subscribe();
        substanceService.getSubtanceDetails({ cutoff: 0.5, pageSize: pageSize, skip: skip }).subscribe();
        substanceService.getSubtanceDetails({ pageSize: pageSize, skip: skip }).subscribe();
        substanceService.getSubtanceDetails({ pageSize: pageSize, skip: skip }).subscribe();
        substanceService.getSubtanceDetails({ pageSize: pageSize, skip: skip }).subscribe();
        substanceService.getSubtanceDetails({ pageSize: pageSize, facets: facets, skip: skip }).subscribe();
        substanceService.getSubtanceDetails({ pageSize: pageSize, skip: skip }).subscribe();

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

        substanceService.getSubtanceDetails({ structureSearchTerm: structureSearchTerm }).subscribe();
        substanceService.getSubtanceDetails({ structureSearchTerm: structureSearchTerm, type: 'test' }).subscribe();
        substanceService.getSubtanceDetails({ structureSearchTerm: structureSearchTerm, cutoff: 0.5 }).subscribe();
        substanceService.getSubtanceDetails({ structureSearchTerm: structureSearchTerm, pageSize: 100 }).subscribe();
        substanceService.getSubtanceDetails({ structureSearchTerm: structureSearchTerm, facets: facets }).subscribe();
        substanceService.getSubtanceDetails({ structureSearchTerm: structureSearchTerm, skip: 10 }).subscribe();

        httpClientGetSpy.calls.all().forEach(call => {
          expect(call.args[0])
            .toEqual('api/v1/substances/structureSearch');
          expect(call.args[1].params.get('q'))
            .toEqual(structureSearchTerm);
        });

      });

      it('first structure search should to go url to get url with results, ' +
        'then immediately make a call to get results. ' +
        'Another call to search the same structure should go straight to get results', async(() => {

          const responseComplete = new Observable(observer => {
            setTimeout(() => {
              observer.next(StructureSearchResponseTestData);
              observer.complete();
            });
          });

          httpClientGetSpy.and.returnValue(responseComplete);

          substanceService.getSubtanceDetails({ structureSearchTerm: structureSearchTerm })
            .subscribe(response => {
              const expectedUrl = `api/v1/status(${StructureSearchResponseTestData.key})/results`;

              substanceService.getSubtanceDetails({ structureSearchTerm: structureSearchTerm })
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

    substanceService.getSubstanceSummaries().subscribe(
      substances => expect(substances).toEqual(expectedSubstanceSummaries, 'should return expected subtances'),
      fail
    );
  });
});
