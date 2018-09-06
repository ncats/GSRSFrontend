import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from './config.model';

@Injectable()
export class ConfigService {

  private _configData: Config;

    constructor(private http: HttpClient) { }

    // This is the method you want to call at bootstrap
    // Important: It should return a Promise
    load(): Promise<any> {

        this._configData = null;

        return this.http
            .get('/assets/data/config.json')
            .toPromise()
            .then((data: Config) => this._configData = data)
            .catch((err: any) => Promise.resolve());
    }

    get configData(): Config {
        return this._configData;
    }
}
