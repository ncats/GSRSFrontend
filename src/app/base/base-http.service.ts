import { ConfigService } from '../config/config.service';
import { environment } from '../../environments/environment';

export abstract class BaseHttpService {
  public apiBaseUrl: string;

  constructor(
    public configService: ConfigService
  ) {
    this.apiBaseUrl = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || environment.apiBaseUrl}api/v1/`;
  }
}
