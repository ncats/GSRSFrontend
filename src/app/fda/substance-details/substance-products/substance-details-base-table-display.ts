import { Component, OnInit, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';

export class SubstanceDetailsBaseTableDisplay extends SubstanceCardBaseFilteredList<any> implements OnInit {

  totalRecords: 0;
  public results: Array<any> = [];
  
  @Input() bdnum: string;

  ngOnInit(): void {
  }

  constructor(
    public gaService: GoogleAnalyticsService,
    private service
  ) {
      super(gaService);
     // this.service = service;
    }

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

    for (let i = 0; i < this.filtered.length; i++) {
      if (this.filtered[i] != null) {
          this.paged.push(this.filtered[i]);
      } else {
          break;
      }
    }
  }

}
