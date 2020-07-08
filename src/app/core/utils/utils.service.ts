import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseHttpService } from '../base/base-http.service';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { SubstanceSuggestionsGroup } from './substance-suggestions-group.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { map } from 'rxjs/operators';
import { BuildInfo } from './build-info.model';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private bodyElement: HTMLBodyElement;
  private matSidenavContentElement: HTMLElement;

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
    private sanitizer: DomSanitizer
  ) {}

  getStructureSearchSuggestions(searchTerm: string): Observable<SubstanceSuggestionsGroup> {
    const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
    return this.http.get<SubstanceSuggestionsGroup>(url + 'suggest?q=' + searchTerm);
  }

  getSafeStructureImgUrl(structureId: string, size: number = 150, stereo?: boolean): SafeUrl {
    if (!stereo) {
      stereo = false;
    }
    const imgUrl = `${this.configService.configData.apiBaseUrl}img/${structureId}.svg?size=${size.toString()}&stereo=${stereo}`;
    return this.sanitizer.bypassSecurityTrustUrl(imgUrl);
  }

  getStructureImgUrl(structureId: string, size: number = 150, stereo?: boolean, atomMaps?: Array<number>, version?: number): string {
    if (!stereo) {
      stereo = false;
    }
    const apiBaseUrl = this.configService.configData.apiBaseUrl;
    const randomKey = Math.random().toString(36).replace('0.', '');
    let url = `${apiBaseUrl}img/${structureId}.svg?size=${size.toString()}&stereo=${stereo}&cache-control=${randomKey}`;
    if (atomMaps != null) {
      url = `${url}&context=${atomMaps.toString()}`;
    }
    if (version != null) {
      url = `${url}&version=${version}`;
    }
    return url;
  }

  handleMatSidenavOpen(widthBreakingPoint?: number): void {

    if (widthBreakingPoint == null || (window && window.innerWidth < widthBreakingPoint)) {
      this.bodyElement = document.getElementsByTagName('BODY')[0] as HTMLBodyElement;
      this.matSidenavContentElement = document.getElementsByTagName('mat-sidenav-content')[0] as HTMLElement;

      this.bodyElement.style.overflowX = 'hidden';
      this.matSidenavContentElement.style.width = `${this.matSidenavContentElement.offsetWidth}px`;
    } else {
      this.handleMatSidenavClose();
    }
  }

  handleMatSidenavClose(): void {
    if (this.bodyElement != null || this.matSidenavContentElement != null) {
      setTimeout(() => {
        this.bodyElement.style.overflowX = null;
        this.matSidenavContentElement.style.width = null;
        this.bodyElement = null;
        this.matSidenavContentElement = null;
      }, 500);
    }
  }

  capitalize(phrase: string): string {
    const stringArray = phrase.split(' ');

    for (let i = 0, x = stringArray.length; i < x; i++) {
      stringArray[i] = stringArray[i][0].toUpperCase() + stringArray[i].substr(1);
    }

    return stringArray.join(' ');
  }

  /* tslint:disable:no-bitwise */
  hashCode(...args): number {
    const stringToHash = JSON.stringify([...args]);
    let hash = 0, i, chr;
    if (stringToHash.length === 0) {
      return hash;
    }
    for (i = 0; i < stringToHash.length; i++) {
      chr   = stringToHash.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  toCamelCase(term: string = ''): string {
    return term
        .replace(/\s(.)/g, ($1) => $1.toUpperCase())
        .replace(/\s/g, '')
        .replace(/^(.)/, ($1) => $1.toLowerCase());
  }

  // https://gist.github.com/jed/982883
  newUUID(
    a?: number                  // placeholder
  ) {
    return a           // if the placeholder was passed, return
      ? (              // a random number from 0 to 15
        a ^            // unless b is 8,
        Math.random()  // in which case
        * 16           // a random number from
        >> a / 4         // 8 to 11
        ).toString(16) // in hexadecimal
      : (              // or otherwise a concatenated string:
        [1e7] as any +        // 10000000 +
        -1e3 +         // -1000 +
        -4e3 +         // -4000 +
        -8e3 +         // -80000000 +
        -1e11          // -100000000000,
        ).replace(     // replacing
          /[018]/g,    // zeroes, ones, and eights with
          this.newUUID            // random hex digits
        );
  }

  // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_get
  getObjectValue(obj: any, path: string, defaultValue: any = null): any {
    String.prototype.split.call(path, /[,[\].]+?/)
      .filter(Boolean)
      .reduce((a: any, c: string) => (Object.hasOwnProperty.call(a, c) ? a[c] : defaultValue), obj);
  }

  uploadFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file-name', file);
    formData.append('file-type', file.type);
    return this.http.post<any>(`${this.configService.configData.apiBaseUrl}upload`, formData)
    .pipe(
      map(response => response && response.url || '')
    );
  }

  sruDisplayToConnectivity(display: string): any {
    if (!display) {
      return {};
    }
    const errors = [];
    const connections = display.split(';');
    const regex = /^\s*[A-Za-z][A-Za-z]*[0-9]*_(R[0-9][0-9]*)[-][A-Za-z][A-Za-z]*[0-9]*_(R[0-9][0-9]*)\s*$/g;
    const mapper = {$errors: []};
    for (let i = 0; i < connections.length; i++) {
      const con = connections[i].trim();
      if (con === '') { continue; }
      regex.lastIndex = 0;
      const res = regex.exec(con);
      if (res == null) {
        const text = 'Connection \'' + con + '\' is not properly formatted';
        errors.push({ text: text, type: 'warning' });
      } else {
        if (!mapper[res[1]]) {
          mapper[res[1]] = [];
        }
        mapper[res[1]].push(res[2]);
      }
    }
    if (errors.length > 0) {
      mapper.$errors = errors;
    }
    return mapper;

  }


  displayAmount(amt): string {

    function formatValue(v) {
      if (v) {
        if (typeof v === 'object') {
          if (v.display) {
            return v.display;
          } else if (v.value) {
            return v.value;
          } else {
            return null;
          }
        } else {
          return v;
        }
      }
      return null;
    }

    let ret = '';
    if (amt) {
      if (typeof amt === 'object') {
        if (amt) {
          let addedunits = false;
          let unittext = formatValue(amt.units);
          if (!unittext) {
            unittext = '';
          }
          const atype = formatValue(amt.type);
          if (atype) {
            ret += atype + '\n';
          }
          if (amt.average || amt.high || amt.low) {
            if (amt.average) {
              ret += amt.average;
              if (amt.units) {
                ret += ' ' + unittext;
                addedunits = true;
              }
            }
            if (amt.high || amt.low) {
              ret += ' [';
              if (amt.high && !amt.low) {
                ret += '<' + amt.high;
              } else if (!amt.high && amt.low) {
                ret += '>' + amt.low;
              } else if (amt.high && amt.low) {
                ret += amt.low + ' to ' + amt.high;
              }
              ret += '] ';
              if (!addedunits) {
                if (amt.units) {
                  ret += ' ' + unittext;
                  addedunits = true;
                }
              }
            }
            ret += ' (average) ';
          }
          if (amt.highLimit || amt.lowLimit) {
            ret += '\n[';
          }
          if (amt.highLimit && !amt.lowLimit) {
            ret += '<' + amt.highLimit;
          } else if (!amt.highLimit && amt.lowLimit) {
            ret += '>' + amt.lowLimit;
          } else if (amt.highLimit && amt.lowLimit) {
            ret += amt.lowLimit + ' to ' + amt.highLimit;
          }
          if (amt.highLimit || amt.lowLimit) {
            ret += '] ';
            if (!addedunits) {
              if (amt.units) {
                ret += ' ' + unittext;
                addedunits = true;
              }
            }
            ret += ' (limits)';
          }
        }
      }
    }
    return ret;
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  getBuildInfo(): Observable<BuildInfo> {
    const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/buildInfo`;
    return this.http.get<BuildInfo>(url);
  }
}
