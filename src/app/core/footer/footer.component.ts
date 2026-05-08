import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfigService } from '@gsrs-core/config';
import { fromEvent, throttleTime } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
  bottom : number = 0;
  htmlText;
  constructor(
    private http:HttpClient,
    private sanitizer:DomSanitizer,
    private configService: ConfigService
  ){ }
  ngOnInit(){
    // const privacyStatement = this.configService.configData.privacyStatement;
    // if(privacyStatement) {
    //   // if used, privacyStatement should be a json encoded string in config.json
    //   this.htmlText = this.sanitizer.bypassSecurityTrustHtml(privacyStatement);
    // } else {
    //   // if used overwrite this file with a simple html version of your privacy statement.
    //   this.http.get('assets/html/privacy-statement.html',{responseType:'text'}).subscribe(result=>{
    //         this.htmlText = this.sanitizer.bypassSecurityTrustHtml(result);
    //   }, error => {
    //       this.htmlText = "Error fetching page content";
    //   });
    // }



  }





}