import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

// tried this:
// import html from '../assets/data/privacy-policy.html';
// this.htmlText = html;
// but it requires a webpack loader, not sure what that is.
// if using this strategy, need to create/add to src/typings.d.ts file with this: 
// declare module '*html'
// {
//  const value:string;
//  export default value
// }

@Component({
  selector: 'app-privacy-statement',
  templateUrl: './privacy-statement.component.html',
  styleUrls: ['./privacy-statement.component.scss']
})
export class PrivacyStatementComponent implements OnInit {
  htmlText;
  constructor(
    private http:HttpClient,
    private sanitizer:DomSanitizer
  ){ }
  ngOnInit(){
    this.http.get('assets/html/privacy-statement.html',{responseType:'text'}).subscribe(result=>{
          this.htmlText = this.sanitizer.bypassSecurityTrustHtml(result);  
    }, error => {
        this.htmlText = "Error fetching page content";
    });
  }
}