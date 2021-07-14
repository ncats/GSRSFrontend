import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { LoadingService } from '@gsrs-core/loading';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../core/utils/utils.service';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { ProductService } from '../service/product.service';
import { GeneralService } from '../../service/general.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-details-base',
  template: '',
  styleUrls: ['./product-details-base.component.scss']
})
export class ProductDetailsBaseComponent implements OnInit, AfterViewInit {

  productId: string;
  src: string;
  product: any;
  iconSrcPath: string;
  message = '';
  private subscriptions: Array<Subscription> = [];

  constructor(
    public productService: ProductService,
    public generalService: GeneralService,
    public activatedRoute: ActivatedRoute,
    public loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private router: Router,
    private gaService: GoogleAnalyticsService,
    private utilsService: UtilsService,
  ) { }

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
    // this.applicationService.unloadSubstance();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  ngAfterViewInit() { }

  getProduct(): void {
    const prodSubscription = this.productService.getProduct(this.productId, this.src).subscribe(response => {
      if (response) {
      this.product = response;
     // if (Object.keys(this.product).length > 0) {
      this.getSubstanceBySubstanceKey();
    //  }
      }
    }, error => {
      this.message = 'No Product record found';
      // this.handleSubstanceRetrivalError();
    });
    this.subscriptions.push(prodSubscription);
  }

  getSubstanceBySubstanceKey() {
    if (this.product != null) {
      this.product.productComponentList.forEach(elementComp => {
        if (elementComp != null) {
          elementComp.productLotList.forEach(elementLot => {
            if (elementLot != null) {
              elementLot.productIngredientList.forEach(elementIngred => {
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
                    const subBasisSubscription =  this.generalService.getSubstanceByAnyId(elementIngred.basisOfStrengthSubstanceKey).subscribe(response => {
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

  /*
  getSubstanceDetails() {
    if (this.product != null) {
      this.product.productComponentList.forEach(elementComp => {
        if (elementComp != null) {
          elementComp.productLotList.forEach(elementLot => {
            if (elementLot != null) {
              elementLot.productIngredientList.forEach(elementIngred => {
                if (elementIngred != null) {
                  // Get Ingredient Name
                  if (elementIngred.bdnum) {
                    this.productService.getSubstanceDetailsByBdnum(elementIngred.bdnum).subscribe(response => {
                      if (response) {
                        if (response.substanceId) {
                          elementIngred.substanceId = response.substanceId;
                          elementIngred.ingredientName = response.name;
                        }
                      }
                    });
                  }

                  // Get Basis of Strength
                  if (elementIngred.basisOfStrengthBdnum) {
                    this.productService.getSubstanceDetailsByBdnum(elementIngred.basisOfStrengthBdnum).subscribe(response => {
                      if (response) {
                        if (response.substanceId) {
                          elementIngred.basisOfStrengthSubstanceId = response.substanceId;
                          elementIngred.basisOfStrengthIngredientName = response.name;
                        }
                      }
                    });
                  }
                }
              });
            }
          });
        }
      });
    }
  }
  */

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
