import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { LoadingService } from '@gsrs-core/loading';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../core/utils/utils.service';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { ProductService } from '../service/product.service';
import { GeneralService } from '../../service/general.service';

@Component({
  selector: 'app-product-details-base',
  template: '',
  styleUrls: ['./product-details-base.component.scss']
})
export class ProductDetailsBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  productId: string;
  src: string;
  product: any;
  iconSrcPath: string;
  message = '';
  isAdmin = false;
  downloadJsonHref: any;
  jsonFileName: string;
  subscriptions: Array<Subscription> = [];

  constructor(
    public productService: ProductService,
    public generalService: GeneralService,
    public activatedRoute: ActivatedRoute,
    public loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private router: Router,
    private gaService: GoogleAnalyticsService,
    private utilsService: UtilsService,
    public titleService: Title,
    public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.loadingService.setLoading(true);
    this.productId = this.activatedRoute.snapshot.params['id'];
    this.src = this.activatedRoute.snapshot.params['src'];

    if (this.productId != null) {
      this.getProduct();
    } else {
      this.handleSubstanceRetrivalError();
    }
    this.loadingService.setLoading(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  ngAfterViewInit() { }

  getProduct(): void {
    const prodSubscription = this.productService.getProduct(this.productId).subscribe(response => {
      if (response) {
        this.product = response;
        if (Object.keys(this.product).length > 0) {

          // Add title on the browser. Concatenate multiple Product Code
          /*let prodCode = '';
          this.product.productCodeList.forEach((elementProdCode, indexProdCode) => {
            if (elementProdCode != null) {
              if (elementProdCode.productCode) {
                if (indexProdCode > 0) {
                  prodCode = prodCode.concat('|');
                }
                prodCode = prodCode.concat(elementProdCode.productCode);
              }
            }
          });*/
          this.titleService.setTitle(`View Product ` + this.product.id);

          this.getSubstanceBySubstanceKey();
        }
      }
    }, error => {
      this.message = 'No Product record found';
      // this.handleSubstanceRetrivalError();
    });
    this.subscriptions.push(prodSubscription);
  }

  getSubstanceBySubstanceKey() {
    if (this.product != null) {
      this.product.productManufactureItems.forEach(elementComp => {
        if (elementComp != null) {
          elementComp.productLots.forEach(elementLot => {
            if (elementLot != null) {
              elementLot.productIngredients.forEach(elementIngred => {
                if (elementIngred != null) {
                  // Get Substance Details, uuid, approval_id, substance name
                  if (elementIngred.substanceKey) {
                    const subSubscription = this.generalService.getSubstanceByAnyId(elementIngred.substanceKey).subscribe(response => {
                      if (response) {
                        elementIngred._substanceUuid = response.uuid;
                        elementIngred._ingredientName = response._name;
                      }
                    });
                    this.subscriptions.push(subSubscription);
                  }

                  // Get Basis of Strength
                  if (elementIngred.basisOfStrengthSubstanceKey) {
                    const subBasisSubscription = this.generalService.getSubstanceByAnyId(elementIngred.basisOfStrengthSubstanceKey)
                      .subscribe(response => {
                        if (response) {
                          elementIngred._basisOfStrengthSubstanceUuid = response.uuid;
                          elementIngred._basisOfStrengthIngredientName = response._name;
                        }
                      });
                    this.subscriptions.push(subBasisSubscription);
                  }
                }
              });  // Ingredient Loop
            }
          }); // Lot Loop
        }
      }); // Component Loop
    }
  }

  saveJSON(): void {
    let json = this.product;
    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(json)));
    this.downloadJsonHref = uri;

    const date = new Date();
    this.jsonFileName = 'product_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');
  }

  private handleSubstanceRetrivalError() {
    this.loadingService.setLoading(false);
    const notification: AppNotification = {
      message: 'The web address above is incorrect. You\'re being forwarded to Browse Substances',
      type: NotificationType.error,
      milisecondsToShow: 4000
    };
    this.mainNotificationService.setNotification(notification);
    setTimeout(() => {
      this.router.navigate(['/browse-substance']);
    }, 5000);
  }

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    return this.utilsService.getSafeStructureImgUrl(structureId, size, true);
  }

}
