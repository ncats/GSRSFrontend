import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '@gsrs-core/auth/auth.service';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { ConfigService } from '@gsrs-core/config';

@Component({
  selector: 'app-download-monitor',
  templateUrl: './download-monitor.component.html',
  styleUrls: ['./download-monitor.component.scss']
})
export class DownloadMonitorComponent implements OnInit {
  @Input() id: string;
  @Input() fromRoute?: boolean;
  @Output() deletedEmitter = new EventEmitter();
  download: any;
  deleted = false;
  exists: boolean;
  browseLink: string;
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.refresh();
  }

  refresh(spawn?: boolean) {
    this.authService.getUpdateStatus(this.id).pipe(take(1)).subscribe( response => {
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
          setTimeout(() => {
            this.refresh(true);
          }, 400);
        }
    }, error => {
      this.exists = false;
    });
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
    if (url.indexOf('status(') < 0){
      url = '?' + url.split('?')[1];

    const urlParams = new URLSearchParams(url);
    let string = '/browse-substance?';
    const paramArr = [];
    const facets = urlParams.getAll('facet');
    facets.forEach(str => {
        const facet = str.split('/');
        let bool = 'true';
        if ( facet[0].indexOf('!') > -1) {
          bool = 'false';
          facet[0] = facet[0].slice(1, facet[0].length);
        }
         let exists = false;
         const value = facet[1] + '.' + bool;
          paramArr.forEach(entry => {
            if (entry.facet === facet[0]) {
              entry.values = entry.values + '%2B' + value;
              exists = true;
            }
          });
          if (exists === false) {
            paramArr.push(
              {'facet': facet[0], 'values': value}
            );
          }
    });
      if (urlParams.has('q')) {
        string += 'search=' + urlParams.get('q') + '&';
      }

      if (urlParams.has('order')) {
        string += 'order=' + urlParams.get('order') + '&';
      }

      if (paramArr.length > 0) {
        string += 'facets=';
        for (let i = 0; i < paramArr.length; i ++) {
          const object = paramArr[i];
          string += object.facet + '*' + object.values;
          if (i < (paramArr.length - 1)) {
            string += ',';
          }
        }
      }
      this.browseLink = string;
  }
}

}
