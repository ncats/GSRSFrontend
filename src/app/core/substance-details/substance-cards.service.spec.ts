import { TestBed } from '@angular/core/testing';
import { SubstanceCardsService } from './substance-cards.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { AuthService } from '@gsrs-core/auth';

describe('SubstanceCardsService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let configService: ConfigService;
  let substanceCardsService: SubstanceCardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    configService = new ConfigService(httpClient);
    configService.configData = { apiBaseUrl: '', services: [], privacyStatement: '' };
    substanceCardsService = new SubstanceCardsService(configService, [], httpClient, {} as AuthService);
  });

  it('should be created', () => {
    expect(substanceCardsService).toBeTruthy();
  });
});
