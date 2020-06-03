import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '@gsrs-core/auth/auth.service';
import * as moment from 'moment';
import { take } from 'rxjs/operators';

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
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.refresh();
  }

  refresh(spawn?: boolean) {
    this.authService.getUpdateStatus(this.id).pipe(take(1)).subscribe( response => {
      this.download = response;
      this.exists = true;
      if (this.download.started) {
        this.download.startedHuman = moment(this.download.started).fromNow();
      }
      if (this.download.finished) {
        this.download.finishedHuman = moment(this.download.finished).fromNow();
      }
        if (this.download.status === 'RUNNING') {
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

}
