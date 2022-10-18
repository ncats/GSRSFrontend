import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { RecordOverview } from '@gsrs-core/bulk-search/bulk-search.model';
import { Summary } from '@gsrs-core/bulk-search/bulk-search.model';
import { AuthService } from '@gsrs-core/auth';
import { LoadingService } from '@gsrs-core/loading';
import { BulkSearchService } from '@gsrs-core/bulk-search/service/bulk-search.service';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { ConfigService } from '@gsrs-core/config';
import { MatPaginator } from '@angular/material/paginator';
import { F } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-bulk-search-results-summary',
  templateUrl: './bulk-search-results-summary.component.html',
  styleUrls: ['./bulk-search-results-summary.component.scss']
})

export class BulkSearchResultsSummaryComponent implements OnInit {
/*
   [summary]      -- expects any if this is provided then loadSummaries should be false.  
   loadSummary    -- if true will run a data load procedure in the component
   context        -- expects the entity CONTEXT being browsed (e.g. substances)
   [key]          -- the bulk search results key  
*/
  @Input() key: string = null;
  @Input() context: string = 'substances';
  // if false, then we expect summaries to be passed as a parameter 
  @Input() loadSummary:boolean = false;
  @ViewChild(MatTable, {static: false}) table : MatTable<RecordOverview>; // initialize
    @ViewChild('paginator') paginator: MatPaginator;

  private _summary: any = null;

  @Input() set summary(value: Array<any>) {
    this.summary=value;
  }

  get summary(): Array<any> { 
    return this._summary;
  }
  
  recordOverviews: Array<RecordOverview> = [];

  displayedColumns: string[] = [
    'searchTerm',
    'matches',
    'displayCode',
    'displayCodeName'
  ];

  displayedColumnNames = {
    'searchTerm': 'Search Term', 
    'matches': 'Matches',
    'displayCode': 'Record UNII',
    'displayCodeName': 'Record Name'
  };

  dataSource = new MatTableDataSource(this.recordOverviews);

  constructor(
    private loadingService: LoadingService,
    public authService: AuthService,
    private notificationService: MainNotificationService,
    private bulkSearchService: BulkSearchService,      
    private configService: ConfigService
  ) {

    const data:any = JSON.parse(`{
    "summary": {
    "qTop":100,
    "qSkip":0,
    "qTotal":2,
    "totalMatched":1,
    "totalUnmatched":1,
    "queries": [{
      "searchTerm": "faketerm",
      "records": []
    }, {         
      "searchTerm": "sodium chloride",
      "records": [{
        "id": "306d24b9-a6b8-4091-8024-02f9ec24b705",
        "displayName": "SODIUM CHLORIDE",
        "displayCode": "451W47IQ8X",
        "displayCodeName": "UNII"
      }, {
        "id": "bd953285-a7a4-2965-cc7d-73bdceb7abd0",
        "displayName": "CAVROTOLIMOD SODIUM",
        "displayCode": "Y50W8NUZ1O",
        "displayCodeName": "UNII"
      }, {
        "id": "79dbcc59-e887-40d1-a0e3-074379b755e4",
        "displayName": "SODIUM ACETATE",
        "displayCode": "4550K0SC9B",
        "displayCodeName": "UNII"
      }, {
        "id": "5b611b0d-b798-45ed-ba02-6f0a2f85986b",
        "displayName": "POTASSIUM CHLORIDE",
        "displayCode": "660YQ98I10",
        "displayCodeName": "UNII"
      }, {
        "id": "90e9191d-1a81-4a53-b7ee-560bf9e68109",
        "displayName": "SODIUM GLUCONATE",
        "displayCode": "R6Q3791S76",
        "displayCodeName": "UNII"
      }, {
        "id": "302cedcc-895f-421c-acf4-1348bbdb31f4",
        "displayName": "MAGNESIUM CHLORIDE",
        "displayCode": "02F3473H9O",
        "displayCodeName": "UNII"
      }, {
        "id": "e92bc4ad-250a-4eef-8cd7-0b0b1e3b6cf0",
        "displayName": "THIOFLAVIN S2",
        "displayCode": "FDK4QJ64TS",
        "displayCodeName": "UNII"
      }, {
        "id": "0d1371fc-904f-45e9-b073-ba55dacc4f30",
        "displayName": "THIOFLAVIN S1",
        "displayCode": "2R5VJA8RQB",
        "displayCodeName": "UNII"
      }]
    }, {
      "searchTerm": "sodium gluconate",
      "records": [{
        "id": "90e9191d-1a81-4a53-b7ee-560bf9e68109",
        "displayName": "SODIUM GLUCONATE",
        "displayCode": "R6Q3791S76",
        "displayCodeName": "UNII"
      }, {
        "id": "bd953285-a7a4-2965-cc7d-73bdceb7abd0",
        "displayName": "CAVROTOLIMOD SODIUM",
        "displayCode": "Y50W8NUZ1O",
        "displayCodeName": "UNII"
      }, {
        "id": "306d24b9-a6b8-4091-8024-02f9ec24b705",
        "displayName": "SODIUM CHLORIDE",
        "displayCode": "451W47IQ8X",
        "displayCodeName": "UNII"
      }, {
        "id": "79dbcc59-e887-40d1-a0e3-074379b755e4",
        "displayName": "SODIUM ACETATE",
        "displayCode": "4550K0SC9B",
        "displayCodeName": "UNII"
      }]
    }, {
      "searchTerm": "potasium chloride",
      "records": [{
        "id": "5b611b0d-b798-45ed-ba02-6f0a2f85986b",
        "displayName": "POTASSIUM CHLORIDE",
        "displayCode": "660YQ98I10",
        "displayCodeName": "UNII"
      }, {
        "id": "306d24b9-a6b8-4091-8024-02f9ec24b705",
        "displayName": "SODIUM CHLORIDE",
        "displayCode": "451W47IQ8X",
        "displayCodeName": "UNII"
      }, {
        "id": "302cedcc-895f-421c-acf4-1348bbdb31f4",
        "displayName": "MAGNESIUM CHLORIDE",
        "displayCode": "02F3473H9O",
        "displayCodeName": "UNII"
      }, {
        "id": "e92bc4ad-250a-4eef-8cd7-0b0b1e3b6cf0",
        "displayName": "THIOFLAVIN S2",
        "displayCode": "FDK4QJ64TS",
        "displayCodeName": "UNII"
      }, {
        "id": "0d1371fc-904f-45e9-b073-ba55dacc4f30",
        "displayName": "THIOFLAVIN S1",
        "displayCode": "2R5VJA8RQB",
        "displayCodeName": "UNII"
      }]
    }]
  }}
    `);
      this._summary = data.summary;


  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    if (this.loadSummary) {  
      this.getBulkSearchResults();
    }
 
    // move this to ngOnChanges 
    if (!this.loadSummary) {  
      if(this._summary.queries) {
        this.summariesToRecordOverviews();
        if(this.table) { 
          this.table.renderRows();
        }  
      }
    }
  }
  ngOnChanges() {   
  }  


  getBulkSearchResults() {
    const subscription = this.bulkSearchService.getBulkSearchResults(this.context, this.key)
    .subscribe(bulkSearchResults => {
      if (!this.key) {
        console.log("Warning, key is null or undefined in getBulkSearchResults");
      }
      if (!this.context) {
        console.log("Warning, context is null or undefined in getBulkSearchResults");
      }
      if(bulkSearchResults?.summary) {
        this._summary = bulkSearchResults.summary;
        // as Array<Summary>;
        this.summariesToRecordOverviews();
        if(this.table) { 
          this.table.renderRows();
        }
      } 
    }, error => {
        console.log("Error getting bulk search results in summary component.");
    }, () => {
      subscription.unsubscribe();
    });
  }

summariesToRecordOverviews() {
  this._summary.queries.forEach( q => {
    let o: RecordOverview = <RecordOverview>{};
    o.searchTerm = q.searchTerm;
    if (q.records) {
      o.matches = q.records.length;
      if(q.records.length==0) {
      o.displayCode = '(no match)';
      o.displayCodeName = '(no match)';
      } else 
        if(q.records.length==1) {
          o.displayCode = q.records[0].displayCode;
          o.displayCodeName = q.records[0].displayCodeName;
      } else 
        if (q.records.length>1) {
          o.displayCode = 'multiple';
          o.displayCodeName = 'multiple';
      }  
    }
    this.recordOverviews.push(o);
  });
}

  testMakeTsvTextFromSummaryQueries() { 
    const s =  this.makeTsvTextFromSummaryQueries(this._summary);
    console.log(s);
  }

testExtractLiberally(){
  this.extractLiberally(['a', 'd', 'c'],{a:'1', b: '2', 'c': 3});
}

  extractLiberally(keys, object) {
    const a: Array<any> = keys.map(k=>{
      return object[k]||'';
    });
    console.log(a);
  }


  makeTsvTextFromSummaryQueries(json: any): string {
    console.log(json);
    const _fieldHeaders =
    'searchTerm|id|idName|displayCode|displayCodeName'; 
    const _fields =
    'searchTerm|id|idName|displayCode|displayCodeName'; 
    const fields = _fields.split('|');
    const searchTermIndex = fields.indexOf('searchTerm');
    const fieldHeaders = _fieldHeaders.split('|');
    let tsvText = fieldHeaders.join("\t")+"\r\n";
    
    

    json.queries.forEach(q => {
      if (q.records.length === 0) {
        const row = [];
        fields.forEach( (f,i) => {
          if (i===searchTermIndex) { 
           row.push(q[f]||''); 
          } else {
           row.push('');  
          }
        });
        tsvText+=row.join("\t")+"\r\n"; 
      } else { 
        q.records.forEach( r => {
          const row = [];
          fields.forEach( (f,i) => {
            if (i===searchTermIndex) { 
              row.push(q[f]||''); 
            } else {
             row.push(r[f]||'');  
            }
          });
          tsvText+=row.join("\t")+"\r\n"; 
        });
      }
    });
    /*
    this._summary.queries.forEach( q => {
      q.records.forEach( r => {
        fields.forEach( (f,i) => {
          if(i===0) {
            tsvText+=q.searchTerm;
          } else { 
            tsvText+=r[f]||'';
          }
          if (i+1 < fields.length) { tsvText+="\t"; }  else { tsvText += "\r\n"; }
        });  
      });
    });
  */
    return tsvText;
  }

  getBulkSearchResultsForDownload(): void {
    const filename: string = this.context + '-testing.tsv';
    const top = 1;
    const skip = 0;
    const qTop = 20000;
    const qSkip = 0;
    this.bulkSearchService.getBulkSearchResults(this.context, this.key, top, skip, qTop, qSkip).subscribe(response => {
    this.downloadSummaryQueriesFile(response, filename);      
    }, error => {
      console.log("Error downloading file in getBulkSearchResultsForDownload.");
    }
    );
  }

  downloadSummaryQueriesFile(response: any, filename: string): void {
    const tsvText = this.makeTsvTextFromSummaryQueries(this._summary);
    const dataType = response.type;
    // const binaryData = [];
    // binaryData.push(response);
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob([tsvText], { type: dataType }));
    downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }


}
