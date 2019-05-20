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

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    domSanitizer = TestBed.get(DomSanitizer);
    configService = new ConfigService(httpClient);
    configService.configData = { apiBaseUrl: '' };
    structureService = new StructureService(domSanitizer, configService, httpClient);
  });

  it('should be created', () => {
    expect(structureService).toBeTruthy();
  });
});
