import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { RecordOverview } from '../../bulk-search.model';
import { Summary } from '../../bulk-search.model';
import { AuthService } from '@gsrs-core/auth';
import { LoadingService } from '@gsrs-core/loading';
import { BulkSearchService } from '../../service/bulk-search.service';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { ConfigService } from '@gsrs-core/config';

@Component({
  selector: 'app-bulk-search-results-summary',
  templateUrl: './bulk-search-results-summary.component.html',
  styleUrls: ['./bulk-search-results-summary.component.scss']
})

export class BulkSearchResultsSummaryComponent implements OnInit {
/*
   [summaries]    -- expects Array<any> if this is provided then loadSummaries should be false.  
   loadSummaries  -- if true will run a data load procedure in the component
   context        -- expects the entity CONTEXT being browsed (e.g. substances)
   [key]          -- the bulk search results key  
*/
  @Input() key: string = null;
  @Input() context: string = 'substances';
  // if false, then we expect summaries to be passed as a parameter 
  @Input() loadSummaries:boolean = false;
  @ViewChild(MatTable, {static: false}) table : MatTable<RecordOverview>; // initialize

  private _summaries: Array<any> = null;

  @Input() set summaries(value: Array<any>) {
    this._summaries=value;
  }

  get summaries(): Array<any> { 
    return this._summaries;
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
  ) {}

  ngAfterViewInit() {}

  ngOnInit(): void {
    if (this.loadSummaries) {  
      this.getBulkSearchResults();
    }
  }

  ngOnChanges() {
    if (!this.loadSummaries) {  
      if(this._summaries) { 
        this.summariesToRecordOverviews();
        if(this.table) { 
          this.table.renderRows();
        }  
      }
    }
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
        this._summaries = bulkSearchResults.summary;
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
    this._summaries.forEach( s => {
      let o: RecordOverview = <RecordOverview>{};
      o.searchTerm = s.searchTerm;
      if (s.records) {
        o.matches = s.records.length;
        if(s.records.length==0) {
        o.displayCode = '(no match)';
        o.displayName = '(no match)';
        } else 
        if(s.records.length==1) {
          o.displayCode = s.records[0].displayCode;
          o.displayCodeName = s.records[0].displayCodeName;
        } else 
        if (s.records.length>1) {
          o.displayCode = 'multiple';
          o.displayCodeName = 'multiple';
        }  
      }
      this.recordOverviews.push(o);
    });

  }

  /*
  data:any = JSON.parse(`[{
    "searchTerm":"sodium chloride",
      "records":[
        {"id":"306d24b9-a6b8-4091-8024-02f9ec24b705","displayName":"SODIUM CHLORIDE","displayCode":"451W47IQ8X","displayCodeName":"UNII"},
        {"id":"bd953285-a7a4-2965-cc7d-73bdceb7abd0","displayName":"CAVROTOLIMOD SODIUM","displayCode":"Y50W8NUZ1O","displayCodeName":"UNII"},
        {"id":"79dbcc59-e887-40d1-a0e3-074379b755e4","displayName":"SODIUM ACETATE","displayCode":"4550K0SC9B","displayCodeName":"UNII"},
        {"id":"5b611b0d-b798-45ed-ba02-6f0a2f85986b","displayName":"POTASSIUM CHLORIDE","displayCode":"660YQ98I10","displayCodeName":"UNII"},
        {"id":"90e9191d-1a81-4a53-b7ee-560bf9e68109","displayName":"SODIUM GLUCONATE","displayCode":"R6Q3791S76","displayCodeName":"UNII"},
        {"id":"302cedcc-895f-421c-acf4-1348bbdb31f4","displayName":"MAGNESIUM CHLORIDE","displayCode":"02F3473H9O","displayCodeName":"UNII"},
        {"id":"e92bc4ad-250a-4eef-8cd7-0b0b1e3b6cf0","displayName":"THIOFLAVIN S2","displayCode":"FDK4QJ64TS","displayCodeName":"UNII"},
        {"id":"0d1371fc-904f-45e9-b073-ba55dacc4f30","displayName":"THIOFLAVIN S1","displayCode":"2R5VJA8RQB","displayCodeName":"UNII"}
        ]}
    ]`);
    this._summaries = this.data as Array<Summary>;
  */
}
