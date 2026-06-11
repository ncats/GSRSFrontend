import { TestBed } from '@angular/core/testing';
import { StructureService } from './structure.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { DomSanitizer } from '@angular/platform-browser';

describe('StructureService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let configService: ConfigService;
  let structureService: StructureService;
  let domSanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    domSanitizer = TestBed.inject(DomSanitizer);
    configService = new ConfigService(httpClient);
    configService.configData = { apiBaseUrl: '' };
    structureService = new StructureService(domSanitizer, configService, httpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(structureService).toBeTruthy();
  });

  it('should interpret the supplied structure rather than a current substance record', () => {
    const molfile = 'historical molfile';
    structureService.getIdentifiersFromStructure(molfile).subscribe(identifiers => {
      expect(identifiers.inchiKey).toBe('UHOVQNZJYSORNB-UHFFFAOYSA-N');
      expect(identifiers.inchi).toBe('InChI=1S/C6H6/c1-2-4-6-5-3-1/h1-6H');
    });

    const request = httpTestingController.expectOne(
      'api/v1/substances/interpretStructure?mode=&standardize=&appendNNOFeatures=true'
    );
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toBe(molfile);
    request.flush({
      structure: {
        _inchiKey: 'UHOVQNZJYSORNB-UHFFFAOYSA-N',
        _inchi: 'InChI=1S/C6H6/c1-2-4-6-5-3-1/h1-6H'
      },
      moieties: [],
      structuralUnits: []
    });
  });
});
