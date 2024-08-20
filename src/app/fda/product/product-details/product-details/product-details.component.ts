import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { LoadingService } from '@gsrs-core/loading';
import { Title } from '@angular/platform-browser';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary/controlled-vocabulary.service';
import { UtilsService } from '../../../../core/utils/utils.service';
import { ConfigService } from '@gsrs-core/config';
import { ProductDetailsBaseComponent } from '../product-details-base.component';
import { GeneralService } from '../../../service/general.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ProductService } from '../../service/product.service';

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
    cvService: ControlledVocabularyService,
    public configService: ConfigService,
    public authService: AuthService,
    titleService: Title,
    overlayContainerService: OverlayContainer,
    dialog: MatDialog,
    public sanitizer: DomSanitizer
  ) {
    super(productService, generalService, activatedRoute, loadingService, mainNotificationService,
      router, gaService, utilsService, cvService, configService, titleService, overlayContainerService, dialog, sanitizer);
  }

  ngOnInit() {
    this.authService.hasAnyRolesAsync('Admin', ', Updater', 'SuperUpdater').subscribe(response => {
      this.isAdmin = response;
    });

    super.ngOnInit();
  }

  ngAfterViewInit() {
  }

}
