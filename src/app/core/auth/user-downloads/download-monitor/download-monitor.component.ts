import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '@gsrs-core/auth/auth.service';

@Component({
  selector: 'app-download-monitor',
  templateUrl: './download-monitor.component.html',
  styleUrls: ['./download-monitor.component.scss']
})
export class DownloadMonitorComponent implements OnInit {
  @Input() id: string;
  download: any;
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    console.log(this.id);
    this.refresh();
  }

  refresh(spawn?: boolean) {
    this.authService.getUpdateStatus(this.id).subscribe( response =>{
      this.download = response;
      console.log(response);
        if (this.download.status === 'RUNNING'){
          setTimeout(()=>{
            this.refresh(true);
          }, 400);
        }
    }, error => {
      console.log(error);
    });
  }

  cancel() {
    this.authService.changeDownload(this.download.cancelUrl.url).subscribe(response => {
      console.log(response);
      this.refresh();
    });
  }

  downloadExport() {
    console.log('calling');
    this.authService.changeDownload(this.download.downloadUrl).subscribe(response => {
      console.log(response);
      this.refresh();
    });
  }

  delete() {
    this.authService.deleteDownload(this.download.removeUrl.url).subscribe(response => {
      console.log(response);
      this.refresh();
    });
  }

  

}
