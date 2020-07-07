import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../../core/utils/utils.service';
import { ProductDetailsBaseComponent} from '../product-details-base.component';
import { ConfigService } from '@gsrs-core/config';

@Component({
  selector: 'app-product-elist-details',
  templateUrl: './product-elist-details.component.html',
  styleUrls: ['./product-elist-details.component.scss']
})

export class ProductElistDetailsComponent extends ProductDetailsBaseComponent implements OnInit, AfterViewInit {

  constructor(
    producService: ProductService,
    activatedRoute: ActivatedRoute,
    loadingService: LoadingService,
    mainNotificationService: MainNotificationService,
    router: Router,
    gaService: GoogleAnalyticsService,
    utilsService: UtilsService,
    public configService: ConfigService
  ) { super(producService, activatedRoute, loadingService, mainNotificationService,
    router, gaService, utilsService);
  }

  ngOnInit() {
    super.ngOnInit();

    this.iconSrcPath = `${this.configService.environment.baseHref || '/'}assets/icons/fda/icon_dailymed.png`;
  }

  ngAfterViewInit() {}

}
