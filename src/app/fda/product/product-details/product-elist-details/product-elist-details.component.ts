import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductService } from '../../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../../core/utils/utils.service';
import { ProductDetailsBaseComponent } from '../product-details-base.component';
import { ConfigService } from '@gsrs-core/config';
import { GeneralService } from '../../../service/general.service';
import { ProductElist } from '../../model/productelist/productelist.model';

@Component({
  selector: 'app-product-elist-details',
  templateUrl: './product-elist-details.component.html',
  styleUrls: ['./product-elist-details.component.scss']
})

export class ProductElistDetailsComponent extends ProductDetailsBaseComponent {

  dailyMedUrl = '';
  product: ProductElist;
  showSpinner = false;

  constructor(
    producService: ProductService,
    generalService: GeneralService,
    activatedRoute: ActivatedRoute,
    loadingService: LoadingService,
    mainNotificationService: MainNotificationService,
    router: Router,
    gaService: GoogleAnalyticsService,
    utilsService: UtilsService,
    public configService: ConfigService
  ) {
    super(producService, generalService, activatedRoute, loadingService, mainNotificationService,
      router, gaService, utilsService);
  }



}
