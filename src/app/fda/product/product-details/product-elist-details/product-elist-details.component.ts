import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';
import { LoadingService } from '@gsrs-core/loading';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../../core/utils/utils.service';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary/controlled-vocabulary.service';
import { ProductDetailsBaseComponent } from '../product-details-base.component';
import { ConfigService } from '@gsrs-core/config';
import { GeneralService } from '../../../service/general.service';
import { ProductElist } from '../../model/productelist/productelist.model';

@Component({
  selector: 'app-product-elist-details',
  templateUrl: './product-elist-details.component.html',
  styleUrls: ['./product-elist-details.component.scss']
})

export class ProductElistDetailsComponent extends ProductDetailsBaseComponent implements OnInit, AfterViewInit, OnDestroy {

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
    public cvService: ControlledVocabularyService,
    public configService: ConfigService,
    titleService: Title,
    public overlayContainerService: OverlayContainer,
    dialog: MatDialog,
    public sanitizer: DomSanitizer
  ) {
    super(producService, generalService, activatedRoute, loadingService, mainNotificationService,
      router, gaService, utilsService, cvService, configService, titleService, overlayContainerService, dialog, sanitizer);
  }

  ngOnInit() {
    this.productId = this.activatedRoute.snapshot.params['id'];
    this.getProduct();
    this.iconSrcPath = `${this.configService.environment.baseHref || ''}assets/icons/fda/icon_dailymed.png`;
  }

  ngAfterViewInit() { }

  getProduct(): void {
    this.loadingService.setLoading(true);
    this.productService.getProductElist(this.productId).subscribe(response => {
      this.product = response;
      if (response) {

        this.titleService.setTitle(`Product ` + this.product.productNDC);

        this.getSubstanceByApprovalID();
        this.dailyMedUrl = 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=' + this.product.productNDC;
      }
    }, error => {
      this.message = 'No Product record found';
    });

    this.loadingService.setLoading(false);
  }

  getSubstanceByApprovalID() {
    if (this.product != null) {

      // Sort Active Substance Name in Ascending order
      if (this.product.prodActiveElistList.length > 0) {
        this.product.prodActiveElistList.sort((a, b) => (a.name < b.name ? -1 : 1));

        // Active Ingredient - get Substance Uuid for each Substance Name
        this.product.prodActiveElistList.forEach(elementActive => {

          if (elementActive != null) {
            // Get Substance Details, uuid
            if (elementActive.unii) {
              const subActiveSubscription = this.generalService.getSubstanceByAnyId(elementActive.unii).subscribe(response => {
                if (response) {
                  elementActive._substanceUuid = response.uuid;
                }
              });
              this.subscriptions.push(subActiveSubscription);
            }
          }
        });
      }

      // Sort Inactive Substance Name in Ascending order
      if (this.product.prodInactiveElistList.length > 0) {
        this.product.prodInactiveElistList.sort((a, b) => (a.name < b.name ? -1 : 1));

        // Inactive Ingredient - get Substance Uuid for each Substance Name
        this.product.prodInactiveElistList.forEach(elementInactive => {
          if (elementInactive != null) {
            // Get Substance Details, uuid
            if (elementInactive.unii) {
              const subInactiveSubscription = this.generalService.getSubstanceByAnyId(elementInactive.unii).subscribe(response => {
                if (response) {
                  elementInactive._substanceUuid = response.uuid;
                }
              });
              this.subscriptions.push(subInactiveSubscription);
            }
          }
        });
      }
    }
  }

}
