import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { UtilsService } from './utils.service';
import { ConfigService } from '../config/config.service';

describe('UtilsService', () => {

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let utilsService: UtilsService;
  let configService: ConfigService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [UtilsService]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    configService = new ConfigService(httpClient);
    utilsService = new UtilsService(httpClient, configService);
  });

  it('should be created', inject([UtilsService], (service: UtilsService) => {
    expect(service).toBeTruthy();
  }));
});
