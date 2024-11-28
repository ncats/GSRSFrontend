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

    // these are a set of callback methods which can be registered
    // to trigger on data load. These are each called exactly once
    // after a successful load, and are used to resolve promises from
    // the afterLoad method
    private _triggers: Array<any> = [];

    constructor(private http: HttpClient) { }

    get configData(): Config {
        return this._configData;
    }

    set configData(configData: Config) {
        this._configData = configData;
    }

    get environment(): Environment {
        return this._environment;
    }

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
                //make ketcher / jsdraw configurable after build
                if (config.structureEditor != null) {
                    environment.structureEditor = config.structureEditor;
                }

                let navItemsCopy = navItems.slice();
                if (config.navItems && config.navItems.length) {
                    const filteredNavItems = config.navItems.filter(navItem => {
                        if (navItem.children != null && navItem.children.length > 0) {
                            let isNotExisting = true;
                            // eslint-disable-next-line prefer-for-of
                            for (let i = 0; i < navItemsCopy.length; i++) {
                                if (navItemsCopy[i].display === navItem.display && navItemsCopy[i].children != null) {
                                    navItemsCopy[i].children = navItemsCopy[i].children.concat(navItem.children);
                                    // eslint-disable-next-line arrow-body-style
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
                //this tells the service to resolve any outstanding Promises for loaded data
                this.executeOnLoadTriggers();
            })
            .catch((err: any) => Promise.resolve());
    }

    // this is the method that gets by the load process itself and is called
    // once after the config service is loaded, going through each registered
    // trigger and executing it, then clearing the trigger list. It shouldn't be
    // called more than once.
    executeOnLoadTriggers() {
        this._triggers.map(cb => cb());
        this._triggers.length = 0;
    }

    // this returns a Promise to return the configData after loading,
    // effectively giving a callback for when the config service is
    // fully loaded. If the service is already loaded it returns
    // a promise which resolves immediately.
    afterLoad(): Promise<any> {
        if (this._configData) {
            return new Promise((resolve, reject) => {
                resolve(this._configData);
            });
        } else {
            return new Promise((resolve, reject) => {
                this._triggers.push(() => {
                    resolve(this._configData);
                });
            });
        }
    };

}
