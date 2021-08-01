import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from './config.model';
import { Environment } from '../../../environments/environment.model';
import { navItems } from './nav-items.constant';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private _configData: Config;
    private _environment: Environment;

    constructor(private http: HttpClient) { }

    // This is the method you want to call at bootstrap
    // Important: It should return a Promise
    load(environment: Environment): Promise<any> {
        this._environment = environment;
        this._configData = null;

        const configFilePath = environment.configFileLocation ?
            environment.configFileLocation : `${environment.baseHref || ''}assets/data/config.json`;

        return this.http
            .get(configFilePath)
            .toPromise()
            .then((config: Config) => {
                if (config.apiBaseUrl == null && environment.apiBaseUrl != null) {
                    config.apiBaseUrl = environment.apiBaseUrl;
                }
                if (config.apiBaseUrl.indexOf('//') > -1) {
                    const parts = config.apiBaseUrl.split('/');
                    config.apiUrlDomain = `${parts[0]}//${parts[2]}`;
                } else {
                    config.apiUrlDomain = '';
                }
                if (config.googleAnalyticsId == null && environment.googleAnalyticsId != null) {
                    config.googleAnalyticsId = environment.googleAnalyticsId;
                }
                if (config.version == null && environment.version != null) {
                    config.version = environment.version;
                }
                if (config.contactEmail == null && environment.contactEmail != null) {
                    config.contactEmail = environment.contactEmail;
                }

                let navItemsCopy = navItems.slice();
                if (config.navItems && config.navItems.length) {
                    const filteredNavItems = config.navItems.filter(navItem => {
                        if (navItem.children != null && navItem.children.length > 0) {
                            let isNotExisting = true;
                            for (let i = 0; i < navItemsCopy.length; i++) {
                                if (navItemsCopy[i].display === navItem.display && navItemsCopy[i].children != null) {
                                    navItemsCopy[i].children = navItemsCopy[i].children.concat(navItem.children);
                                    navItemsCopy[i].children.sort((a, b) => {
                                        return a.order - b.order;
                                    });
                                    isNotExisting = false;
                                    break;
                                }
                            }
                            return isNotExisting;
                        } else {
                            return true;
                        }
                    });
                    navItemsCopy = navItemsCopy.concat(filteredNavItems);
                    navItemsCopy.sort((a, b) => {
                        return a.order - b.order;
                    });
                }
                config.navItems = navItemsCopy;
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

    get environment(): Environment {
        return this._environment;
    }
}
