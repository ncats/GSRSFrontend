import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../../core/utils/utils.service';
import { ProductDetailsBaseComponent } from '../product-details-base.component';
import { GeneralService } from '../../../service/general.service';
import { AuthService } from '@gsrs-core/auth/auth.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent extends ProductDetailsBaseComponent implements OnInit, AfterViewInit {

  constructor(
    public productService: ProductService,
    generalService: GeneralService,
    activatedRoute: ActivatedRoute,
    loadingService: LoadingService,
    mainNotificationService: MainNotificationService,
    router: Router,
    gaService: GoogleAnalyticsService,
    utilsService: UtilsService,
    public authService: AuthService
  ) {
    super(productService, generalService, activatedRoute, loadingService, mainNotificationService,
      router, gaService, utilsService);
  }

  ngOnInit() {
    this.authService.hasAnyRolesAsync('Admin', 'Updater', 'SuperUpdater').subscribe(response => {
      this.isAdmin = response;
    });

    super.ngOnInit();
  }

  ngAfterViewInit() {
  }

}
