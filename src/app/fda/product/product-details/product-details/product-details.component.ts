import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../../core/utils/utils.service';
import { ProductDetailsBaseComponent } from '../product-details-base.component';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent extends ProductDetailsBaseComponent implements OnInit, AfterViewInit {

  constructor(
    public productService: ProductService,
    activatedRoute: ActivatedRoute,
    loadingService: LoadingService,
    mainNotificationService: MainNotificationService,
    router: Router,
    gaService: GoogleAnalyticsService,
    utilsService: UtilsService,
  ) {
    super(productService, activatedRoute, loadingService, mainNotificationService,
      router, gaService, utilsService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewInit() {
  }

}
