import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Config } from './config.model';
import { environment } from '../../../environments/environment';

describe('ConfigService', () => {

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let configService: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    configService = new ConfigService(httpClient);
  });

  it('should be created', () => {
    expect(configService).toBeTruthy();
  });

  it('should get config data after load call', () => {
    let configData: Config;
    configService.load(environment).then(() => {
      configData = configService.configData;
      expect(configData.apiBaseUrl).toBeTruthy('should return a config object with an apiBaseUrl property');
    });
  });
});
