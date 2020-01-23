import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

import { UtilsService } from './utils.service';
import { ConfigService } from '../config/config.service';

describe('UtilsService', () => {

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let utilsService: UtilsService;
  let configService: ConfigService;
  let domSanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    domSanitizer = TestBed.get(DomSanitizer);
    configService = new ConfigService(httpClient);
    configService.configData = { apiBaseUrl: '' };
    utilsService = new UtilsService(httpClient, configService, domSanitizer);
  });

  it('should be created', () => {
    expect(utilsService).toBeTruthy();
  });
});
