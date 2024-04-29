import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';

/* GSRS Core Import */
import { LoadingService } from '@gsrs-core/loading';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../core/utils/utils.service';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary/controlled-vocabulary.service';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { VocabularyTerm } from '@gsrs-core/controlled-vocabulary/vocabulary.model';

/* GSRS Product Import */
import { ProductService } from '../service/product.service';
import { GeneralService } from '../../service/general.service';
import { Product } from '../model/product.model';

@Component({
  selector: 'app-product-details-base',
  template: '',
  styleUrls: ['./product-details-base.component.scss']
})
export class ProductDetailsBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  ingredientNameActiveMoiety = new Array<String>();
  basisOfStrengthActiveMoiety = new Array<String>();
  productId: string;
  src: string;
  product: Product;
  iconSrcPath: string;
  message = '';
  isAdmin = false;
  downloadJsonHref: any;
  jsonFileName: string;
  subscriptions: Array<Subscription> = [];
  languageVocabulary: { [vocabularyTermValue: string]: VocabularyTerm } = {};

  constructor(
    public productService: ProductService,
    public generalService: GeneralService,
    public activatedRoute: ActivatedRoute,
    public loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private router: Router,
    private gaService: GoogleAnalyticsService,
    private utilsService: UtilsService,
    public cvService: ControlledVocabularyService,
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

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('LANGUAGE').subscribe(response => {
      this.languageVocabulary = response['LANGUAGE'] && response['LANGUAGE'].dictionary;

      // Display Language by full description. Example: display 'en' to 'English'.
      if (this.product.language && this.product.language.length > 0) {
        if (this.languageVocabulary[this.product.language]) {
          if (this.languageVocabulary[this.product.language].display) {
            this.product.language = this.languageVocabulary[this.product.language].display;
          }
        }
      }

      // Display Language by full description in Product Name section
      this.product.productProvenances.forEach(elementProv => {
        if (elementProv != null) {
          elementProv.productNames.forEach(elementName => {
            if (elementName != null) {
              if (elementName.language && elementName.language.length > 0) {
                if (this.languageVocabulary[elementName.language]) {
                  if (this.languageVocabulary[elementName.language].display) {
                    elementName.language = this.languageVocabulary[elementName.language].display;
                  }
                }
              }
            }
          });
        }
      });
    });  // getDomainVocabulary
  }

  getProduct(): void {
    const prodSubscription = this.productService.getProduct(this.productId).subscribe(response => {
      if (response) {
        this.product = response;
        if (Object.keys(this.product).length > 0) {
          this.titleService.setTitle(`View Product ` + this.product.id);

          // Get Language vocabularies
          this.getVocabularies();

          // Get Ingredient Name for the Substance Key
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

              // Sort Ingredient Name by Inredient Type ('Active Ingredient', 'Inactive Ingredient', etc)
              if (elementLot.productIngredients.length > 0) {
                elementLot.productIngredients.sort((a, b) => (a.ingredientType < b.ingredientType ? -1 : 1));
              }

              elementLot.productIngredients.forEach(elementIngred => {
                if (elementIngred != null) {
                  // Get Substance Details, uuid, approval_id, substance name
                  if (elementIngred.substanceKey) {
                    const subSubscription = this.generalService.getSubstanceByAnyId(elementIngred.substanceKey).subscribe(response => {
                      if (response) {
                        elementIngred._substanceUuid = response.uuid;
                        elementIngred._ingredientName = response._name;

                        // Get Active Moiety
                        if (elementIngred._substanceUuid) {
                          this.getActiveMoiety(elementIngred._substanceUuid, 'ingredientname');
                        }
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

  getActiveMoiety(substanceUuid: string, type: string) {
    if (substanceUuid != null) {
      // Get Active Moiety - Relationship
      this.generalService.getSubstanceRelationships(substanceUuid).subscribe(responseRel => {
        if (responseRel) {
          if (responseRel && responseRel.length > 0) {
            for (let i = 0; i < responseRel.length; i++) {
              const relType = responseRel[i].type;
              // if type is ACTIVE MOIETY, get Relationship Name
              if (relType && relType === 'ACTIVE MOIETY') {
                if (responseRel[i].relatedSubstance.name) {
                  if ((type != null) && (type === 'ingredientname')) {
                    this.ingredientNameActiveMoiety.push(responseRel[i].relatedSubstance.name);
                  } else {
                    this.basisOfStrengthActiveMoiety.push(responseRel[i].relatedSubstance.name);
                  }
                }
                break;
              }
            }
          }
        }
      });
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
