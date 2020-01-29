import { ConfigService } from '../config/config.service';

export abstract class BaseHttpService {
  public apiBaseUrl: string;
  public baseUrl: string;
  
  constructor(
    public configService: ConfigService
  ) {
    this.apiBaseUrl = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
    this.baseUrl = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }`;
  }
}
