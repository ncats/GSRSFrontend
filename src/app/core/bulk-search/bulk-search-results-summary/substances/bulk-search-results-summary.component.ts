import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { RecordOverview } from '@gsrs-core/bulk-search/bulk-search.model';
import { AuthService } from '@gsrs-core/auth';
import { LoadingService } from '@gsrs-core/loading';
import { BulkSearchService } from '@gsrs-core/bulk-search/service/bulk-search.service';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { ConfigService } from '@gsrs-core/config';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NavigationExtras, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bulk-search-results-summary',
  templateUrl: './bulk-search-results-summary.component.html',
  styleUrls: ['./bulk-search-results-summary.component.scss']
})

export class BulkSearchResultsSummaryComponent implements OnInit {
/*
   [summary]      -- expects any if this is provided then loadSummary should be false.  
   loadSummary    -- if true will run a data load procedure in the component
   context        -- expects the entity CONTEXT being browsed (e.g. substances)
   [key]          -- the bulk search results key  
*/
  @Input() key: string = null;
  @Input() context: string = 'substances';

  // if false, then we expect the summary to be passed as a parameter 
  @Input() loadSummary:boolean = true;
  @ViewChild(MatTable, {static: false}) table : MatTable<RecordOverview>; // initialize
  @ViewChild('paginator') paginator: MatPaginator;

  private _summary: any = null;
  private _summaryForDownload: any = null;
  
  qPageSize: number;
  qPageIndex: number;
  qOrder: number;
  recordOverviewsShownOnPage: number;
  recordOverviews: Array<RecordOverview> = [];
  totalRecordOverviews: number; 
  totalQueries: number; 

  @Input() set summary(value: Array<any>) {
    this.summary=value;
  }

  get summary(): Array<any> { 
    return this._summary;
  }
  
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
    private configService: ConfigService,
    private router: Router,
    private location: Location
  ) {
    // const data:any = JSON.parse(``);
    // this._summary = data.summary;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.qPageSize = 10;
    this.qPageIndex = 0;
    if (this.loadSummary) {  
      this.getBulkSearchStatusResults();
    }
  }
  ngOnChanges() { 
    // This approach was tested early on but not later on in developemnt.
    if (!this.loadSummary) {  
      if(this._summary.queries) {
        this.summaryToRecordOverviews();
      }
    }
  }  

  changePage(pageEvent: PageEvent) {
    let eventAction: any;
    let eventValue: any;
    if (this.qPageSize !== pageEvent.pageSize) {
      eventAction = 'select:page-size';
      eventValue = pageEvent.pageSize;
    } else if (this.qPageIndex !== pageEvent.pageIndex) {
      eventAction = 'icon-button:page-number';
      eventValue = pageEvent.pageIndex + 1;
    }
    // this.gaService.sendEvent('substancesContent', eventAction, 'pager', eventValue);
    this.qPageSize = pageEvent.pageSize;
    this.qPageIndex = pageEvent.pageIndex;
    this.getBulkSearchStatusResults();
  }


  // see substances code
  populateUrlQueryParameters(): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    // navigationExtras.queryParams['searchTerm'] = this.privateSearchTerm;
    // navigationExtras.queryParams['cutoff'] = this.privateSearchCutoff;
    // navigationExtras.queryParams['type'] = this.privateSearchType;
    navigationExtras.queryParams['order'] = this.qOrder;
    navigationExtras.queryParams['qTop'] = this.qPageSize;
    navigationExtras.queryParams['qTop'] = this.qPageIndex;
    navigationExtras.queryParams['qSkip'] = this.qPageIndex * this.qPageSize;

    const urlTree = this.router.createUrlTree([], {
      queryParams: navigationExtras.queryParams,
      queryParamsHandling: 'merge',
      preserveFragment: true
    });
    this.location.go(urlTree.toString());
  }

  // see substances code
  clearSearch(): void {
    // const eventLabel = environment.isAnalyticsPrivate ? 'search term' : this.privateSearchTerm;
    // this.gaService.sendEvent('substancesFiltering', 'icon-button:clear-search', eventLabel);
    // this.privateSearchTerm = '';
    this.qPageIndex = 0;
    this.populateUrlQueryParameters();
    this.getBulkSearchStatusResults();
  }


  getBulkSearchStatusResults() {
    const qSkip = this.qPageIndex * this.qPageSize;
    const subscription = this.bulkSearchService.getBulkSearchStatusResults(
      this.key,
      0, // we don't need content here just the summaries
      0,
      this.qPageSize,
      qSkip
    )
    .subscribe(bulkSearchResults => {
      if (!this.key) {
        console.log("Warning, key is null or undefined in getBulkSearchStatusResults.");
      }
      if (!this.context) {
        console.log("Warning, context is null or undefined in getBulkSearchStatusResults.");
      }
      if(bulkSearchResults?.summary) {
        this._summary = bulkSearchResults.summary;
        this.totalQueries = this._summary.qTotal; 
        this.summaryToRecordOverviews();
        if(this.table) { 
          this.table.dataSource = this.recordOverviews;
          this.recordOverviewsShownOnPage = this.recordOverviews.length;
          this.table.renderRows();
        }
      } 
    }, error => {
        console.log("Error getting bulk search results in summary component.");
    }, () => {
      subscription.unsubscribe();
    });
  }

summaryToRecordOverviews() {
  this.recordOverviews = [];
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
  this.recordOverviews = this.recordOverviews;
}

  makeTsvTextFromSummaryQueries(json: any): string {
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
    return tsvText;
  }

  getBulkSearchStatusResultsSummaryForDownload(): void {
    let filename: string = '';
    let context: string;
    let finished: boolean = false;
    const qTop = 20000;
    const qSkip = 0;
    let s1: Subscription;
    let s2: Subscription;
     s1 = this.bulkSearchService.getBulkSearchStatus(this.key).subscribe(response => {
      context = response.context;
      finished = response.finished;
      if (context === undefined) {
        alert("Context (entity type) must be defined in the JSON response.");
      } else if (finished !== true) { 
        alert("The seach is not yet finshed. Please try clicking again after a time.");
      } else {        
        // top and skip are zero because we don't need the content array for the download. 
        s2 = this.bulkSearchService.getBulkSearchStatusResults(this.key, 0, 0, qTop, qSkip).subscribe(response => {
          this._summaryForDownload = response.summary;
          filename =  context + '-bulk-search-summary-' + this.key + '.tsv';  
          this.downloadSummaryQueriesFile(response, filename);     
        }, error => {
          console.log("Error downloading file in getBulkSearchStatusResultsSummaryForDownload.");
        }
        );
      }  
    },
    ()=> { 
      s1.unsubscribe();
      s2.unsubscribe()
    }
    );
  }

  downloadSummaryQueriesFile(response: any, filename: string): void {
    const tsvText = this.makeTsvTextFromSummaryQueries(this._summaryForDownload);
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
