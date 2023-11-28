import { ConfigService } from './config.service';
import { environment } from '../../../environments/environment';

// eslint-disable-next-line ban-types
export function configServiceFactory(startupService: ConfigService): Function {
    return () => startupService.load(environment);
}
