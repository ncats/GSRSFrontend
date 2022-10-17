import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-bulk-search-search-terms-by-id',
  templateUrl: './bulk-search-search-terms-by-id.component.html',
  styleUrls: ['./bulk-search-search-terms-by-id.component.scss']
})
export class BulkSearchSearchTermsByIdComponent implements OnInit {
  @Input() summaries: Array<any> = [];
  @Input() id: any = null;
  _:any = null;
  searchTerms: Array<string> = [];

  constructor() { 
    this._= _;
  }
 
  ngOnInit(): void { 
    this.findSearchTerms();
  }

  findSearchTerms() {
    this.searchTerms=[];
    const searchTermsHash = {};
    if(this.summaries && this.summaries.length>0) {
      this.summaries.forEach(s => {
        if (s?.records) { 
          s.records.forEach(r => {
            if (r?.id && r.id === this.id) {
              if(searchTermsHash[s.searchTerm]==undefined) { 
                this.searchTerms.push(s.searchTerm);
                searchTermsHash[s.searchTerm] = s.searchTerm;
              }    
            }
          });
        }
      });
    }
  }

}
