import { SubstanceCardBase } from './substance-card-base';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { environment } from '../../environments/environment';

export class SubstanceCardBaseFilteredList<T> extends SubstanceCardBase {
    filtered: Array<T>;
    paged: Array<T>;
    page = 0;
    pageSize = 5;
    private searchTimer: any;
    searchControl = new FormControl();

    constructor(
        public gaService: GoogleAnalyticsService
    ) {
        super();
    }

    pageChange(pageEvent?: PageEvent, analyticsEventCategory?: string): void {

        if (pageEvent != null) {

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

            this.page = pageEvent.pageIndex;
            this.pageSize = pageEvent.pageSize;
        }

        this.paged = [];
        const startIndex = this.page * this.pageSize;
        for (let i = startIndex; i < (startIndex + this.pageSize); i++) {
            if (this.filtered[i] != null) {
                this.paged.push(this.filtered[i]);
            } else {
                break;
            }
        }
    }

    filterList(searchInput: string, listToFilter: Array<T>): void {
        if (this.searchTimer != null) {
            clearTimeout(this.searchTimer);
        }

        this.searchTimer = setTimeout(() => {
            this.filtered = [];
            listToFilter.forEach(item => {

                const itemString = JSON.stringify(item).toLowerCase();
                if (itemString.indexOf(searchInput.toLowerCase()) > -1) {
                    this.filtered.push(item);
                }
                /*   const keys = Object.keys(item);
                   let contains = false;
                   for (let i = 0; i < keys.length; i++) {
                       if (item[keys[i]].toString().toLowerCase().indexOf(searchInput.toLowerCase()) > -1) {
                           contains = true;
                           break;
                       }
                   }
                   if (contains) {
                       this.filtered.push(item);
                   }*/
            });
            clearTimeout(this.searchTimer);
            this.searchTimer = null;
            this.page = 0;
            this.pageChange();
        }, 700);
    }
}
