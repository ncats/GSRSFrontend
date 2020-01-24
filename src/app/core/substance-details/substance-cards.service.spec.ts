import { TestBed } from '@angular/core/testing';
import { SubstanceCardsService } from './substance-cards.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';

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

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    configService = new ConfigService(httpClient);
    configService.configData = { apiBaseUrl: '' };
    substanceCardsService = new SubstanceCardsService(configService);
  });

  it('should be created', () => {
    expect(substanceCardsService).toBeTruthy();
  });
});
