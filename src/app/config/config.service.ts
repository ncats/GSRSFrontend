import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from './config.model';
import { Environment } from '../../environments/_base-environment';

@Injectable()
export class ConfigService {

    private _configData: Config;

    constructor(private http: HttpClient) { }

    // This is the method you want to call at bootstrap
    // Important: It should return a Promise
    load(environment: Environment): Promise<any> {

        this._configData = null;

        const configFilePath = `${environment.baseHref || '/'}assets/data/config.json`;

        return this.http
            .get(configFilePath)
            .toPromise()
            .then((config: Config) => {
                if (config.apiBaseUrl == null && environment.apiBaseUrl != null) {
                    config.apiBaseUrl = environment.apiBaseUrl;
                }
                if (config.googleAnalyticsId == null && environment.googleAnalyticsId != null) {
                    config.googleAnalyticsId = environment.googleAnalyticsId;
                }
                if (config.version == null && environment.version != null) {
                    config.version = environment.version;
                }
                this._configData = config;
            })
            .catch((err: any) => Promise.resolve());
    }

    get configData(): Config {
        return this._configData;
    }

    set configData(configData: Config) {
        this._configData = configData;
    }
}
