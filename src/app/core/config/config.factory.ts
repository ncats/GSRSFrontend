import { ConfigService } from './config.service';
import { environment } from '../../../environments/environment';

// eslint-disable-next-line ban-types
export function configServiceFactory(configService: ConfigService): () => Promise<void> {
    return () => configService.load(environment);
  }
