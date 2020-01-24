import { Component, OnInit, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';

export class SubstanceDetailsBaseTableDisplay extends SubstanceCardBaseFilteredList<any> implements OnInit {
    ngOnInit(): void {
        console.log("ON INIT");
        throw new Error("Method not implemented.");
    }

    constructor(
        public gaService: GoogleAnalyticsService
    ) {
        super(gaService);
    }
}
