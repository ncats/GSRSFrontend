import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../service/general.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-user-manual',
  templateUrl: './user-manual.component.html',
  styleUrls: ['./user-manual.component.scss']
})
export class UserManualComponent implements OnInit {

  message: string;

  constructor(
    private generalService: GeneralService,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getUserManual();
  }

  getUserManual(): void {
    this.generalService.getManualFile().subscribe(response => {
      let filename =  response.headers.get('Content-Disposition').split(';')[1].split('filename')[1].split('=')[1].trim();
      if (filename == null) {
        filename = 'FDA_GSRS_User_Manual.pdf';
      }
      this.downloadFile(response.body, filename);
    });
  }

  downloadFile(response: any, filename: string): void {
    const dataType = 'application/x-download';
    const binaryData = [];
    binaryData.push(response);
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
    downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    this.message = 'The User Manual has been downloaded to your local download directory';
  }

}
