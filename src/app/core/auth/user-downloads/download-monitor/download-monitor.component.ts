import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from '@gsrs-core/auth/auth.service';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { ConfigService } from '@gsrs-core/config';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-download-monitor',
  templateUrl: './download-monitor.component.html',
  styleUrls: ['./download-monitor.component.scss']
})
export class DownloadMonitorComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() fromRoute?: boolean;
  @Output() deletedEmitter = new EventEmitter();
  download: any;
  deleted = false;
  exists: boolean;
  browseLink = false;
  parameters: NavigationExtras = {};
  facetArray = [];
  displayOrder: string;
  type?: string;
  killed = false;
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.refresh();
  }

  refresh(stop?: boolean) {
    if (!stop) {
      this.authService.getUpdateStatus(this.id).pipe(take(1)).subscribe(response => {
        //    console.log((this.exists? this.exists : 't') + '---' + this.download.status);
        this.download = response;
        if (response.originalQuery) {
          this.processQuery(response.originalQuery);
        }

        this.exists = true;
        if (this.download.started) {
          this.download.startedHuman = moment(this.download.started).fromNow();
        }
        if (this.download.finished) {
          this.download.finishedHuman = moment(this.download.finished).fromNow();
        }
        if (this.download.status === 'RUNNING' || this.download.status === 'PREPARING' || this.download.status === 'INITIALIZED') {
          if (!this.killed) {
            setTimeout(() => {
              this.refresh();
            }, 1400);
          }
        }
      }, error => {
        this.exists = false;
      });
    }
  }

  ngOnDestroy() {
    this.killed = true;
    this.exists = false;
    this.refresh(true);
  }

  cancel() {
    this.authService.changeDownload(this.download.cancelUrl.url).pipe(take(1)).subscribe(response => {
      this.refresh();
    });
  }

  downloadExport() {
    this.authService.changeDownload(this.download.downloadUrl).pipe(take(1)).subscribe(response => {
      this.refresh();
    });
  }

  deleteDownload() {
    this.authService.deleteDownload(this.download.removeUrl.url).pipe(take(1)).subscribe(response => {
      this.deleted = true;
    });
  }

  processQuery(url: string) {
    if (url.indexOf('status(') < 0) {
      this.browseLink = true;
      if (url.indexOf('v1/products') > 0) {
        this.type = 'product';
      } else if ((url.indexOf('v1/applications') > 0) || (url.indexOf('v1/applicationsall') > 0)) {
        this.type = 'application';
      } else if
      ((url.indexOf('v1/adverseeventpt') > 0) || (url.indexOf('v1/adverseeventdme') > 0) || (url.indexOf('v1/adverseeventcvm') > 0)) {
        this.type = 'adverseevent';
      } else {
        this.type = 'browse';
      }
      url = url.split('?')[1];

      const urlParams = new URLSearchParams(url);
      this.facetArray = [];
      const facets = urlParams.getAll('facet');
      facets.forEach(str => {
        const facet = str.split('/');
        let bool = 'true';
        if (facet[0].indexOf('!') > -1) {
          bool = 'false';
          facet[0] = facet[0].slice(1, facet[0].length);
        }
        let exists = false;
        facet[1] = encodeURIComponent(facet[1]);
        const value = facet[1] + '.' + bool;
        this.facetArray.forEach(entry => {
          if (entry.facet === facet[0]) {
            // build valuestring for queryParams and values for template display
            entry.valueString = entry.valueString + '+' + value;
            entry.values.push(bool === 'false' ? 'NOT ' + facet[1] : facet[1]);
            exists = true;
          }
        });
        if (exists === false) {
          this.facetArray.push(
            { facet: facet[0], valueString: value, values: [bool === 'false' ? 'NOT ' + facet[1] : facet[1]] }
          );
        }
      });
      if (urlParams.has('q')) {
        this.parameters['search'] = urlParams.get('q');
      }

      if (urlParams.has('order')) {
        this.parameters['order'] = urlParams.get('order');
        let order = urlParams.get('order');
        if (order.charAt(0) === '$') {
          order = order.slice(1, order.length);
          order = order.replace('root_', '') + ' - descending';

        }
        if (order.charAt(0) === '^') {
          order = order.slice(1, order.length);
          order = order.replace('root_', '') + ' - ascending';
        }
        this.displayOrder = order;
      }

      if (this.facetArray.length > 0) {
        let facetVal = '';
        for (let i = 0; i < this.facetArray.length; i++) {
          const object = this.facetArray[i];
          facetVal += object.facet + '*' + object.valueString;
          if (i < (this.facetArray.length - 1)) {
            facetVal += ',';
          }
        }
        this.parameters['facets'] = facetVal;
      }
    }
  }

}
