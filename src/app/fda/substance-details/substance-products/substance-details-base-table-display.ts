import { OnInit, Input, Directive } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { GoogleAnalyticsService } from "@gsrs-core/google-analytics";
import { SubstanceCardBaseFilteredList } from "@gsrs-core/substance-details";

// Directive decorator required for Angular features (@Input)
// Base class - extended by components, not used directly
@Directive()
export class SubstanceDetailsBaseTableDisplay
  extends SubstanceCardBaseFilteredList<any>
  implements OnInit
{
  totalRecords: number = 0;
  public results: Array<any> = [];
  isAdmin = false;
  exportUrl: string;

  @Input() bdnum: string;

  constructor(
    public gaService: GoogleAnalyticsService,
    private service: any // Base class accepts any service type - child classes pass specific services
  ) {
    super(gaService);
    // this.service = service;
  }

  ngOnInit(): void {}

  setPageEvent(pageEvent?: PageEvent): void {
    if (pageEvent != null) {
      this.page = pageEvent.pageIndex;
      this.pageSize = pageEvent.pageSize;
    }
  }

  setResultData(results: Array<any>, totalRecords?: number): void {
    this.results = results;
    this.filtered = results;
    this.totalRecords = this.service.totalRecords;
    this.pageChangeFda();
  }

  pageChangeFda(pageEvent?: PageEvent, analyticsEventCategory?: string): void {
    if (pageEvent != null) {
      /*
      let eventAction;
      let eventValue;

      if (this.pageSize !== pageEvent.pageSize) {
          eventAction = 'select:page-size';
          eventValue = pageEvent.pageSize;
      } else if (this.page !== pageEvent.pageIndex) {
          eventAction = 'icon-button:page-number';
          eventValue = pageEvent.pageIndex + 1;
      }

      this.gaService.sendEvent(analyticsEventCategory, eventAction, 'pager', eventValue);
      */
      // this.page = pageEvent.pageIndex;
      // this.pageSize = pageEvent.pageSize;
    }

    this.paged = [];

    if (this.filtered) {
      for (let i = 0; i < this.filtered.length; i++) {
        if (this.filtered[i] != null) {
          this.paged.push(this.filtered[i]);
        } else {
          break;
        }
      }
    }
  }
}
