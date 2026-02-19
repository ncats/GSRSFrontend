import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import * as moment from 'moment';
import * as _ from 'lodash';

/* GSRS Core Import */
import { LoadingService } from '@gsrs-core/loading';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../core/utils/utils.service';
import { ConfigService } from '@gsrs-core/config';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary/controlled-vocabulary.service';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { VocabularyTerm } from '@gsrs-core/controlled-vocabulary/vocabulary.model';
import { StructureImageModalComponent, StructureService } from '@gsrs-core/structure';
import { JsonDialogFdaComponent } from '../../json-dialog-fda/json-dialog-fda.component';

/* GSRS Product Import */
import { ProductService } from '../service/product.service';
import { GeneralService } from '../../service/general.service';
import { Product, ProductIngredient } from '../model/product.model';
import jp from 'jsonpath';

@Component({
  selector: 'app-product-details-base',
  template: '',
  styleUrls: ['./product-details-base.component.scss']
})
export class ProductDetailsBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  private ACTIVE_INGREDIENT_UPPERCASE = 'ACTIVE INGREDIENT';
  private ACTIVE_INGREDIENT_LOWERCASE = 'Active Ingredient';

  activeIngredients: Array<ProductIngredient> = [];
  otherIngredients: Array<ProductIngredient> = [];

  showMoreLessActiveIngred = false;
  showMoreLessOtherIngred = false;

  showMoreLessSummaries = false;
  showMoreLessFullDetails = false;

  showMoreLessManufacture = false;

  ingredientNameActiveMoiety = new Array<String>();
  basisOfStrengthActiveMoiety = new Array<String>();
  productId: string;
  src: string;
  product: Product;
  iconSrcPath: string;
  dailyMedUrlConfig = '';
  message = '';
  canUpdate: boolean = false;
  downloadJsonHref: any;
  jsonFilename: string;
  private overlayContainer: HTMLElement;
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
    public configService: ConfigService,
    public titleService: Title,
    public overlayContainerService: OverlayContainer,
    public dialog: MatDialog,
    public sanitizer: DomSanitizer) { }

  async ngOnInit() {
    this.overlayContainer = this.overlayContainerService.getContainerElement();

    this.loadingService.setLoading(true);
    this.productId = this.activatedRoute.snapshot.params['id'];
    this.src = this.activatedRoute.snapshot.params['src'];

    this.iconSrcPath = `${this.configService.environment.baseHref || ''}assets/icons/fda/icon_dailymed.png`;

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

          // Get Ingredient Name Strength
          this.getIngredientStrengthDisplay();

          // Get Daily Med Url
          this.getDailyMedUrlforProductCode();

          // Get PhPID Url if Product Code Type is PhPID
          this.getPhpIdUrlforProductCode();

          // Get RxNorm Url if Product Code Type is RxNorm
          this.getRxNormUrlforProductCode();

          // Get Application Type and Application Number Url to go to Browse Application page.
          this.getApplicationNumberTypeUrl();

          // Sort Product Codes by ascending alphabetically
          this.sortProductCodes();
        }
      }
    }, error => {
      this.message = 'No Product record found';
      // this.handleSubstanceRetrivalError();
    });
    this.subscriptions.push(prodSubscription);
  }

  getSubstanceBySubstanceKey() {
    // Set to []
    this.product._activeIngredients = [];
    this.product._otherIngredients = [];

    // Hide/Show
    this.showMoreLessActiveIngred = true;
    this.showMoreLessOtherIngred = true;

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
                  elementIngred._ingredientNameActiveMoieties = [];

                  // Get Substance Details, uuid, approval_id, substance name
                  if (elementIngred.substanceKey) {
                    const subSubscription = this.generalService.getSubstanceByAnyId(elementIngred.substanceKey).subscribe(response => {
                      if (response) {
                        elementIngred._substanceUuid = response.uuid;
                        elementIngred._ingredientName = response._name;
                        elementIngred._approvalId = response.approvalID;
                        let substanceApprovalId = response.approvalID;

                        // if Substance is public
                        if (response.access && response.access.length < 1) {

                          // Get Active Moiety, only if Substance is APPROVED
                          if (substanceApprovalId) {
                            this.getActiveMoiety(elementIngred, substanceApprovalId, 'ingredientname');
                          } // if Substance Approval ID exists

                        } // if Substance is public

                        // Substance Type, convert from 'Chemical' to 'C', and for other types also
                        if (response.substanceClass) {
                          let subClassIndex = this.generalService.substanceClassArray.findIndex(subClass => subClass.class === response.substanceClass);
                          if (subClassIndex > -1) {
                            elementIngred._substanceClass = this.generalService.substanceClassArray[subClassIndex].shortDisplay;
                          }
                        }

                        // if Ingredient Type exists
                        if (elementIngred.ingredientType) {

                          // Active Ingredient Count
                          if (elementIngred.ingredientType == this.ACTIVE_INGREDIENT_UPPERCASE
                            || elementIngred.ingredientType == this.ACTIVE_INGREDIENT_LOWERCASE) {

                            // Store Active Ingredient in an Array
                            this.product._activeIngredients.push(elementIngred);
                          }
                          // Inactive and Other Ingredient Count
                          else if (elementIngred.ingredientType != this.ACTIVE_INGREDIENT_UPPERCASE
                            && elementIngred.ingredientType != this.ACTIVE_INGREDIENT_LOWERCASE) {

                            // Store Active Ingredient in an Array
                            this.product._otherIngredients.push(elementIngred);
                          }
                        } // if Ingredient Type exists
                        else {
                          // if there is no Ingredient Type
                          this.product._otherIngredients.push(elementIngred);
                        }

                      } // if reponse
                    });
                    this.subscriptions.push(subSubscription);
                  }

                  // Get Basis of Strength
                  if (elementIngred.basisOfStrengthSubstanceKey) {

                    elementIngred._basisOfStrengthActiveMoieties = [];

                    const subBasisSubscription = this.generalService.getSubstanceByAnyId(elementIngred.basisOfStrengthSubstanceKey)
                      .subscribe(response => {
                        if (response) {
                          elementIngred._basisOfStrengthSubstanceUuid = response.uuid;
                          elementIngred._basisOfStrengthIngredientName = response._name;
                          let bosSubstanceApprovalId = response.approvalID;

                          // if Substance is public
                          if (response.access && response.access.length < 1) {

                            // Get Active Moiety, only if Substance is APPROVED
                            if (bosSubstanceApprovalId) {
                              this.getActiveMoiety(elementIngred, bosSubstanceApprovalId, 'basisofstrength');
                            } // if Substance Approval ID exists

                          } // if Substance is public

                        } // response
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

  getActiveMoiety(elementIngred: any, substanceUuid: string, type: string) {
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
                    elementIngred._ingredientNameActiveMoieties.push(responseRel[i].relatedSubstance.name);
                  } else { // basis of strength
                    elementIngred._basisOfStrengthActiveMoieties.push(responseRel[i].relatedSubstance.name);
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

  getSubstanceClass(substanceClass: string): string {
    if (substanceClass) {
      let subClassIndex = this.generalService.substanceClassArray.findIndex(subClass => subClass.shortDisplay === substanceClass);
      if (subClassIndex > -1) {
        return "The Substance Type is " + this.generalService.substanceClassArray[subClassIndex].longDisplay;
      }
    }
    return "";
  }

  sortProductCodes() {
    this.product.productProvenances.forEach((prov, indexProv) => {
      // Sort by Product Code Type, such as NDC CODE 
      prov.productCodes.sort((a, b) => (a.productCodeType < b.productCodeType ? -1 : 1));
    });
  }

  getDailyMedUrlforProductCode(): void {
    // Get Daily Med Url from Configuration
    this.dailyMedUrlConfig = this.generalService.getDailyMedUrlConfig();

    this.product.productProvenances.forEach((prov, indexProv) => {
      prov.productCodes.forEach(prodCode => {

        // if Product Code Type is 'NDC CODE', show Daily Med link on the Product page.
        if (prodCode) {
          if (prodCode.productCode) {
            if (prodCode.productCodeType && prodCode.productCodeType === 'NDC CODE') {
              prodCode._dailyMedUrl = this.dailyMedUrlConfig + prodCode.productCode;
            }
          }
        }
      });
    });
  }

  getPhpIdUrlforProductCode(): void {
    let phpIdUrlConfig = this.generalService.getPhpIdUrlConfig();

    this.product.productProvenances.forEach((prov, indexProv) => {
      prov.productCodes.forEach(prodCode => {

        // if Product Code Type is 'PHPID', show PhpID link on the browse Product page.
        if (prodCode) {
          if (prodCode.productCode) {
            if (prodCode.productCodeType && prodCode.productCodeType.trim().toLowerCase() === 'phpid') {
              // If phpId Url exists in the frontend config, get the url and concatenate PhpId code
              if (phpIdUrlConfig) {
                prodCode._phpIdUrl = phpIdUrlConfig + prodCode.productCode;
              }
            }
          }
        }
      });
    });
  }

  getRxNormUrlforProductCode(): void {
    let rxNormUrlConfig = this.generalService.getRxNormUrlConfig();

    this.product.productProvenances.forEach((prov, indexProv) => {
      prov.productCodes.forEach(prodCode => {

        // if Product Code Type is 'RxNorm', show RxNorm link on the browse Product page.
        if (prodCode) {
          if (prodCode.productCode) {
            if (prodCode.productCodeType && prodCode.productCodeType.trim().toLowerCase() === 'rxnorm') {
              // If phpId Url exists in the frontend config, get the url and concatenate PhpId code
              if (rxNormUrlConfig) {
                prodCode._rxNormUrl = rxNormUrlConfig + prodCode.productCode;
              }
            }
          }
        }
      });
    });
  }

  getIngredientStrengthDisplay() {
    this.product.productManufactureItems.forEach((elementManuItem, indexManuItem) => {

      elementManuItem.productLots.forEach((elementLot, indexLot) => {
        elementLot.productIngredients.forEach((elementIngred, indexIngred) => {

          // Display Strength details in readable format
          if (elementIngred.originalNumeratorNumber && elementIngred.originalNumeratorUnit != null) {
            elementIngred._ingredientStrengthDisplay = elementIngred.originalNumeratorNumber + ' '
              + elementIngred.originalNumeratorUnit.toLowerCase();

            if (elementIngred.originalDenominatorNumber && elementIngred.originalDenominatorUnit != null) {
              // if Denominator Number is '1' and Denominator Unit is '1', do not display these values
              if ((elementIngred.originalDenominatorUnit == '1') && (elementIngred.originalDenominatorNumber == '1')) {
                // Do something here
              } else {
                elementIngred._ingredientStrengthDisplay = elementIngred._ingredientStrengthDisplay
                  + ' per ' + elementIngred.originalDenominatorNumber + ' '
                  + elementIngred.originalDenominatorUnit;
              }
            }
          }
        }); // ingredient loop
      }); // product lot loop
    }); // product manufacture Items loop            
  }

  getApplicationNumberTypeUrl() {
    this.product.productProvenances.forEach((prov, indexProv) => {
      if ((prov.applicationType) && (prov.applicationNumber)) {
        if (prov.applicationType.toUpperCase() !== 'OTC MONOGRAPH FINAL' && prov.applicationType.toUpperCase() !== 'OTC MONOGRAPH NOT FINAL') {
          prov._applicationUrl = 'root_appType:"^' + prov.applicationType + '$" AND root_appNumber:"^' + prov.applicationNumber + '$"';
        }
      }
    });
  }

  saveJSON(): void {
    const copyProd = _.cloneDeep(this.product);
    let cleanProduct = this.scrub(copyProd);

    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(cleanProduct)));
    this.downloadJsonHref = uri;

    const date = new Date();
    this.jsonFilename = 'product_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');
  }

  showJSON(): void {
    const date = new Date();
    let jsonFilename = 'product_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');

    const copyProd = _.cloneDeep(this.product);
    let cleanProduct = this.scrub(copyProd);

    let data = { jsonData: cleanProduct, jsonFilename: jsonFilename };

    const dialogRef = this.dialog.open(JsonDialogFdaComponent, {
      width: '90%',
      height: '90%',
      data: data
    });

    // this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
    });
    this.subscriptions.push(dialogSubscription);
  }

  openImageModal(subUuid: string, displayName?: string, approvalID?: string): void {
    let data: any;
    data = {
      structure: subUuid,
      uuid: subUuid,
      approvalID: approvalID,
      displayName: displayName
    };

    const dialogRef = this.dialog.open(StructureImageModalComponent, {
      height: '90%',
      width: '650px',
      panelClass: 'structure-image-panel',
      data: data
    });

    this.overlayContainer.style.zIndex = '1002';

    const subscription = dialogRef.afterClosed().subscribe(() => {
      this.overlayContainer.style.zIndex = null;
      subscription.unsubscribe();
    }, () => {
      this.overlayContainer.style.zIndex = null;
      subscription.unsubscribe();
    });
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

  toggleShowMoreLessActiveIngred() {
    this.showMoreLessActiveIngred = !this.showMoreLessActiveIngred;
  }

  toggleShowMoreLessOtherIngred() {
    this.showMoreLessOtherIngred = !this.showMoreLessOtherIngred;
  }

  toggleShowMoreLessSummaries() {
    this.showMoreLessSummaries = !this.showMoreLessSummaries;
  }

  toggleShowMoreLessFullDetails() {
    this.showMoreLessFullDetails = !this.showMoreLessFullDetails;
  }

  toggleShowMoreLessManufacture() {
    this.showMoreLessManufacture = !this.showMoreLessManufacture;
  }

  scrub(oldraw: any): any {
    const old = oldraw;

    const activeMoietyHolders = jp.query(old, '$..[?(@._ingredientNameActiveMoieties)]');
    for (let i = 0; i < activeMoietyHolders.length; i++) {
      if (activeMoietyHolders[i]._ingredientNameActiveMoieties) {
        delete activeMoietyHolders[i]._ingredientNameActiveMoieties;
      }
    }

    const basisOfStrenghActiveMoietyHolders = jp.query(old, '$..[?(@._basisOfStrengthActiveMoieties)]');
    for (let i = 0; i < basisOfStrenghActiveMoietyHolders.length; i++) {
      if (basisOfStrenghActiveMoietyHolders[i]._basisOfStrengthActiveMoieties) {
        delete basisOfStrenghActiveMoietyHolders[i]._basisOfStrengthActiveMoieties;
      }
    }

    const basisOfStrengthSubUuidHolders = jp.query(old, '$..[?(@._basisOfStrengthSubstanceUuid)]');
    for (let i = 0; i < basisOfStrengthSubUuidHolders.length; i++) {
      if (basisOfStrengthSubUuidHolders[i]._basisOfStrengthSubstanceUuid) {
        delete basisOfStrengthSubUuidHolders[i]._basisOfStrengthSubstanceUuid;
      }
    }

    const basisOfStrengthIngNameHolders = jp.query(old, '$..[?(@._basisOfStrengthIngredientName)]');
    for (let i = 0; i < basisOfStrengthIngNameHolders.length; i++) {
      if (basisOfStrengthIngNameHolders[i]._basisOfStrengthIngredientName) {
        delete basisOfStrengthIngNameHolders[i]._basisOfStrengthIngredientName;
      }
    }

    const substanceUuidHolders = jp.query(old, '$..[?(@._substanceUuid)]');
    for (let i = 0; i < substanceUuidHolders.length; i++) {
      if (substanceUuidHolders[i]._substanceUuid) {
        delete substanceUuidHolders[i]._substanceUuid;
      }
    }

    const ingredientNameHolders = jp.query(old, '$..[?(@._ingredientName)]');
    for (let i = 0; i < ingredientNameHolders.length; i++) {
      if (ingredientNameHolders[i]._ingredientName) {
        delete ingredientNameHolders[i]._ingredientName;
      }
    }

    const approvalIdHolders = jp.query(old, '$..[?(@._approvalId)]');
    for (let i = 0; i < approvalIdHolders.length; i++) {
      if (approvalIdHolders[i]._approvalId) {
        delete approvalIdHolders[i]._approvalId;
      }
    }

    const applicationUrlHolders = jp.query(old, '$..[?(@._applicationUrl)]');
    for (let i = 0; i < applicationUrlHolders.length; i++) {
      if (applicationUrlHolders[i]._applicationUrl) {
        delete applicationUrlHolders[i]._applicationUrl;
      }
    }

    const dailyMedUrlHolders = jp.query(old, '$..[?(@._dailyMedUrl)]');
    for (let i = 0; i < dailyMedUrlHolders.length; i++) {
      if (dailyMedUrlHolders[i]._dailyMedUrl) {
        delete dailyMedUrlHolders[i]._dailyMedUrl;
      }
    }

    const phpIdUrlHolders = jp.query(old, '$..[?(@._phpIdUrl)]');
    for (let i = 0; i < phpIdUrlHolders.length; i++) {
      if (phpIdUrlHolders[i]._phpIdUrl) {
        delete phpIdUrlHolders[i]._phpIdUrl;
      }
    }

    const rxNormUrlHolders = jp.query(old, '$..[?(@._rxNormUrl)]');
    for (let i = 0; i < rxNormUrlHolders.length; i++) {
      if (rxNormUrlHolders[i]._rxNormUrl) {
        delete rxNormUrlHolders[i]._rxNormUrl;
      }
    }

    const ingredStrenthDisplayHolders = jp.query(old, '$..[?(@._ingredientStrengthDisplay)]');
    for (let i = 0; i < ingredStrenthDisplayHolders.length; i++) {
      if (ingredStrenthDisplayHolders[i]._ingredientStrengthDisplay) {
        delete ingredStrenthDisplayHolders[i]._ingredientStrengthDisplay;
      }
    }

    const ingredSubstanceClassHolders = jp.query(old, '$..[?(@._substanceClass)]');
    for (let i = 0; i < ingredSubstanceClassHolders.length; i++) {
      if (ingredSubstanceClassHolders[i]._substanceClass) {
        delete ingredSubstanceClassHolders[i]._substanceClass;
      }
    }


    delete old['_activeIngredients'];
    delete old['_otherIngredients'];

    return old;
  }

}
