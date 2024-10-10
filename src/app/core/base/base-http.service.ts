import { ConfigService } from '../config/config.service';

export abstract class BaseHttpService {
  public apiBaseUrl: string;
  public pfdaApiBaseUrl: string = '';
  public baseUrl: string;

  constructor(
    public configService: ConfigService
  ) {
    this.apiBaseUrl = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
    if (this.configService.configData.isPfdaVersion && this.configService.configData.pfdaApiBaseUrl) {
      this.pfdaApiBaseUrl = this.configService.configData.pfdaApiBaseUrl;
    }
    this.baseUrl = (this.configService.configData && this.configService.configData.apiBaseUrl) || '/';
  }
}
