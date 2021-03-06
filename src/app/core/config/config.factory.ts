import { ConfigService } from './config.service';
import { environment } from '../../../environments/environment';

export function configServiceFactory(startupService: ConfigService): Function {
    return () => startupService.load(environment);
}
