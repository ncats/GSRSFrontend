import { ConfigService } from './config.service';

export function configServiceFactory(startupService: ConfigService): Function {
    return () => startupService.load();
}