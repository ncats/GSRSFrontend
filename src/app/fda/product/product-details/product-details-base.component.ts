import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../core/utils/utils.service';
import { SafeUrl } from '@angular/platform-browser';
import { ConfigService } from '@gsrs-core/config';

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

  constructor(
    public productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private router: Router,
    private gaService: GoogleAnalyticsService,
    private utilsService: UtilsService,
    public configService: ConfigService
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
  }

  ngAfterViewInit() { }

  getProduct(): void {
    this.productService.getProduct(this.productId, this.src).subscribe(response => {
      this.product = response;
      if (Object.keys(this.product).length > 0) {
        if ((this.src != null) && (this.src === 'srs')) {
          this.getSubstanceDetails();
        }
      }
      this.loadingService.setLoading(false);
    }, error => {
      this.handleSubstanceRetrivalError();
    });
  }

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
