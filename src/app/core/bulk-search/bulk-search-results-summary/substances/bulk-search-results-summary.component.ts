import { Component, OnInit, ViewChild, Input, AfterViewInit, OnChanges } from '@angular/core';
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
import { interval, Subscription, switchMap, takeWhile } from 'rxjs';
import { MatSort, Sort} from '@angular/material/sort';

@Component({
  selector: 'app-bulk-search-results-summary[context][key]',
  templateUrl: './bulk-search-results-summary.component.html',
  styleUrls: ['./bulk-search-results-summary.component.scss']
})

export class BulkSearchResultsSummaryComponent implements OnInit, AfterViewInit, OnChanges {
/*
   showTitle      -- Show the table header title
   [summary]      -- expects any if this is provided then loadSummary should be false.
   loadSummary    -- if true will run a data load procedure in the component
   context        -- expects the entity CONTEXT being browsed (e.g. substances)
   [key]          -- the bulk search results key
   [isCollapsed]  -- hide the summary if true. 
*/
  @Input() key: string = null;
  @Input() context = 'substances';

  // if false, then we expect the summary to be passed as a parameter
  @Input() loadSummary = true;
  @Input() showTitle = true;
  @Input() isCollapsed = false;
  @ViewChild(MatTable, {static: false}) table: MatTable<RecordOverview>; // initialize
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  // https://code-maze.com/angular-material-table/

  qPageSize: number;
  qPageIndex: number;
  qSort: string;
  qFilter: string;
  qFilteredTotal: number;
  recordOverviewsShownOnPage: number;
  recordOverviews: Array<RecordOverview> = [];
  totalRecordOverviews: number;
  totalQueries: number;
  totalQueriesMatch: number;
  totalQueriesUnMatch: number;
  
  isLoggedIn = false;
  showDeprecated: boolean;
  isAdmin = false;
  showAudit = false;
  isPolling = true;
  
  private pollingInterval = 2500;
  private displayCodeHeader: string;
  private defaultDisplayCodeHeader = 'Code';
  private defaultIdHeader = 'Id';
  
  

  sortValues: Array<any> = [
    {
      'value': '^searchTerm',
      'display': 'Search Term Ascending '
    },
    {
      'value': '$searchTerm',
      'display': 'Search Term Descending'
    },
    {
      'value': '^records_length',
      'display': 'Matches Ascending'
    },
    {
      'value': '$records_length',
      'display': 'Matches Descending'
    }
  ];

  filterValues: Array<any> = [
    {
      'value': '',
      'display': 'No filter'
    },
    {
      'value': 'records_length:0',
      'display': 'No matches'
    },
    {
      'value': 'records_length:1',
      'display': 'One match'
    },
    {
      'value': 'records_length>0',
      'display': 'One or more matches'
    },
    {
      'value': 'records_length>1',
      'display': 'More than one match'
    }
  ];

  displayedColumns: string[] = [
    'searchTerm',
    'displayName',
    'matches',
    'displayCode'
  ];

  displayedColumnNames = {
    searchTerm: 'Search Term',
    displayName: 'Display Name',
    matches: 'Matches',
    displayCode: 'Code' // replace with the value in the first row of displayCodeName that has data or "Code"
  };

  dataSource = new MatTableDataSource(this.recordOverviews);


  private _summary: any = null;
  private _summaryForDownload: any = null;


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
  get summary(): Array<any> {
    return this._summary;
  }

  @Input() set summary(value: Array<any>) {
    this.summary=value;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    

    const authSubscription = this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.isLoggedIn = true;
      } else {
        this.showDeprecated = false;
      }
      this.isAdmin = this.authService.hasAnyRoles('Updater', 'SuperUpdater');
      this.showAudit = this.authService.hasRoles('admin');
    });

    this.qPageSize = 10;
    this.qPageIndex = 0;
    if (this.loadSummary) {
      this.pollUntillCompleted();
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

    navigationExtras.queryParams['qSort'] = this.qSort;
    navigationExtras.queryParams['qFilter'] = this.qFilter;
    navigationExtras.queryParams['qTop'] = this.qPageSize;
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

  pollUntillCompleted() {
    interval(this.pollingInterval)
      .pipe(
        switchMap(() =>this.bulkSearchService.getBulkSearchStatus(this.key)),
        takeWhile(( response ) => {
          if (response?.finished === true) {
            return false;
          }
          return true;
        })
      ).subscribe(
        _ => {},
        _ => {},
        () => {
          this.isPolling = false;
          this.getBulkSearchStatusResults();
        }
      );
  }

  sortData(sort: Sort) {
    this.qSort = '';
    if (sort.active === 'searchTerm') {
      if (sort.direction === 'asc') {
        this.qSort = this.sortValues[0].value;
      } else if (sort.direction === 'desc') { 
        this.qSort = this.sortValues[1].value;      
      }
    } else if (sort.active==='matches') {
      if (sort.direction === 'asc') {
        this.qSort = this.sortValues[2].value;
      } else if (sort.direction === 'desc') { 
        this.qSort = this.sortValues[3].value;      
      }
    }
    this.getBulkSearchStatusResults();
  }

  setAndFilterData(qFilter: string) { 
    this.qFilter=qFilter;
    this.qPageIndex = 0;
    this.getBulkSearchStatusResults();
  }

  getBulkSearchStatusResults() {
    const qSkip = this.qPageIndex * this.qPageSize;
    const subscription = this.bulkSearchService.getBulkSearchStatusResults(
      this.key,
      0, // we don't need content here just the summaries
      0,
      this.qPageSize,
      qSkip,
      this.qSort,
      this.qFilter
    )
    .subscribe(bulkSearchResults => {
      if (!this.key) {
        console.log('Warning, key is null or undefined in getBulkSearchStatusResults.');
      }
      if (!this.context) {
        console.log('Warning, context is null or undefined in getBulkSearchStatusResults.');
      }
      if(bulkSearchResults?.summary) {
        this._summary = bulkSearchResults.summary;
        this.totalQueries = this._summary.qTotal;
        this.qFilteredTotal = this._summary.qFilteredTotal;
        this.totalQueriesMatch = this._summary.qMatchTotal;
        this.totalQueriesUnMatch = this._summary.qUnMatchTotal;

        this.summaryToRecordOverviews();
        if(this.displayCodeHeader=='') {
          this.displayedColumnNames['displayCode'] = 
            this.defaultDisplayCodeHeader;
        } else { 
          this.displayedColumnNames['displayCode'] = 
            this.displayCodeHeader;
        }
        if(this.table) {
          this.table.dataSource = this.recordOverviews;
          this.recordOverviewsShownOnPage = this.recordOverviews.length;
          this.table.renderRows();
        }
      }
    }, error => {
        console.log('Error getting bulk search results in summary component.');
    }, () => {
      subscription.unsubscribe();
    });
  }
  
summaryToRecordOverviews() {

  this.displayCodeHeader = '';
  this.recordOverviews = [];
  this._summary.queries.forEach( q => {
    const o: RecordOverview = {} as RecordOverview;
    o.searchTerm = q.searchTerm;
    o.modifiedSearchTerm = q.modifiedSearchTerm;
    if (q.records) {
      o.matches = q.records.length;
      if(q.records.length === 0) {
      o.displayName = '(no match)';
      o.id = '(no match)';
      o.displayCode = '(no match)';
      o.displayCodeName = '(no match)';
      } else
        if(q.records.length === 1) {
          o.displayName = q.records[0].displayName;
          o.id = q.records[0].id;;
          o.displayCode = q.records[0].displayCode;
          o.displayCodeName = q.records[0].displayCodeName;
          // get this for summary table header 
          if(this.displayCodeHeader==='') {
            this.displayCodeHeader = q.records[0].displayCodeName;
          }
      } else
        if (q.records.length>1) {
          o.displayName = 'multiple';
          o.id = 'multiple';
          o.displayCode = 'multiple';
          o.displayCodeName = 'multiple';
      }
    }
    this.recordOverviews.push(o);
  });
  this.recordOverviews = this.recordOverviews;
}

  makeTsvTextFromSummaryQueries(json: any): string {

    // searchTerm|matches|displayName|id|idName|displayCode|displayCodeName;

    // replace header for id with the first idName found.
    // replace header for displayCode with the first displayCodeName found.
  
    let _displayCodeHeader = '';
    let _displayCodeHeaderFound = false;
    let _idHeader = '';
    let _idHeaderFound = false;

    let tsvText = '';

    json.queries.forEach(q => {
      if (q.records.length === 0) {
        tsvText +=
           (q['searchTerm']||'')+'\t'
           +q.records.length+'\t'
           +''+'\t'
           +''+'\t'
           +''+"\n";
      } else {
        q.records.forEach( r => {
          if(!_displayCodeHeaderFound && r['displayCodeName']) {
            _displayCodeHeader = r['displayCodeName'];
            _displayCodeHeaderFound = true;
          }
          if(!_idHeaderFound && r['idName']) {
            _idHeader = r['idName'];
            _idHeaderFound = true;
          }
          tsvText +=
          (q['searchTerm']||'')+'\t'
          +(q.records.length)+'\t'
          +(r['displayName']||'')+'\t'
          +(r['id']||'')+'\t'
          +(r['displayCode']||'')+"\n";
        });

      }
    });

    if(!_displayCodeHeaderFound)  {
      _displayCodeHeader = this.defaultDisplayCodeHeader;
    }
    if(!_idHeaderFound) {
      _idHeader = this.defaultIdHeader;
    }

    const tsvHeaders =
    'searchTerm'+'\t'
    +'matches'+'\t'
    +'displayName'+'\t'
    +_idHeader+'\t'
    +_displayCodeHeader+"\n";


    return tsvHeaders + tsvText;
  }

  getBulkSearchStatusResultsSummaryForDownload(): void {
    let filename = '';
    let context: string;
    let finished = false;
    const qTop = 20000;
    const qSkip = 0;

    let s2: Subscription;
     const s1 = this.bulkSearchService.getBulkSearchStatus(this.key).subscribe(response1 => {
      context = response1.context;
      finished = response1.finished;
      if (context === undefined) {
        alert('Context (entity type) must be defined in the JSON response.');
      } else if (finished !== true) {
        alert('The seach is not yet finshed. Please try clicking again after a time.');
      } else {
        // top and skip are zero because we don't need the content array for the download.
        s2 = this.bulkSearchService.getBulkSearchStatusResults(this.key, 0, 0, qTop, qSkip)
        .subscribe(response2 => {
          this._summaryForDownload = response2.summary;
          filename =  context + '-bulk-search-summary-' + this.key + '.txt';
          this.downloadSummaryQueriesFile(response2, filename);
        }, error => {
          console.log('Error downloading file in getBulkSearchStatusResultsSummaryForDownload.');
        }
        );
      }
    },
    ()=> {
      s1.unsubscribe();
      s2.unsubscribe();
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
