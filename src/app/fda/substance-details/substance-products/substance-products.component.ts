import { Component, OnInit } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details/substance-card-base-filtered-list';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics/google-analytics.service';

@Component({
  selector: 'app-substance-products',
  templateUrl: './substance-products.component.html',
  styleUrls: ['./substance-products.component.scss']
})
export class SubstanceProductsComponent extends SubstanceCardBaseFilteredList<any> implements OnInit {
  public products: Array<any> = [];

  constructor(
    public gaService: GoogleAnalyticsService
  ) {
    super(gaService);
  }

  ngOnInit() {
  }

}
