import { Component, OnInit, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ProductService } from '../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ControlledVocabularyService } from '../../../core/controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../../core/controlled-vocabulary/vocabulary.model';
import { Product, ValidationMessage } from '../model/product.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import * as defiant from '@gsrs-core/../../../node_modules/defiant.js/dist/defiant.min.js';
import { Title } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SubstanceEditImportDialogComponent } from '@gsrs-core/substance-edit-import-dialog/substance-edit-import-dialog.component';
import { JsonDialogFdaComponent } from '../../json-dialog-fda/json-dialog-fda.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})

export class ProductFormComponent implements OnInit, AfterViewInit, OnDestroy {

  product: Product;
  id?: number;
  isLoading = true;
  showSubmissionMessages = false;
  submissionMessage: string;
  validationMessages: Array<ValidationMessage> = [];
  validationResult = false;
  private subscriptions: Array<Subscription> = [];
  copy: string;
  private overlayContainer: HTMLElement;
  serverError: boolean;
  isDisableData = false;
  username = null;
  title = null;
  isAdmin = false;
  expiryDateMessage = '';
  manufactureDateMessage = '';
  viewProductUrl = '';
  message = '';
  downloadJsonHref: any;
  jsonFileName: string;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private gaService: GoogleAnalyticsService,
    private utilsService: UtilsService,
    private cvService: ControlledVocabularyService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private overlayContainerService: OverlayContainer,
    private dialog: MatDialog,
    private titleService: Title,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.isAdmin = this.authService.hasRoles('admin');
    this.loadingService.setLoading(true);
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    this.username = this.authService.getUser();
    const routeSubscription = this.activatedRoute
      .params
      .subscribe(params => {
        if (params['id']) {
          const id = params['id'];
          this.title = 'Update Product';
          if (id !== this.id) {
            this.id = id;
            this.gaService.sendPageView(`Edit Product`);
            this.titleService.setTitle(`Edit Product ` + this.id);
            this.getProductDetails();
          }
        } else if (this.activatedRoute.snapshot.queryParams['copyId']) {
          this.id = this.activatedRoute.snapshot.queryParams['copyId'];
          if (this.id) {  //copy from existing Product
            this.gaService.sendPageView(`Register Product from Copy`);
            this.titleService.setTitle(`Register Product from Copy ` + this.id);
            this.getProductDetails('copy');
          }
        } else if (this.activatedRoute.snapshot.queryParams['action']) {
          let actionParam = this.activatedRoute.snapshot.queryParams['action'];
          if (actionParam && actionParam === 'import' && window.history.state) {
            this.gaService.sendPageView(`Import Product`);
            const record = window.history.state.record;
            const response = JSON.parse(record);
            if (response) {
              this.scrub(response);
              this.productService.loadProduct(response);
              this.product = this.productService.product;
              this.loadingService.setLoading(false);
              this.isLoading = false;
            }
          }
        } else { // Register New Product
          this.title = 'Register New Product';
          setTimeout(() => {
            this.gaService.sendPageView(`Register Product`);
            this.titleService.setTitle(`Register Product`);
            this.productService.loadProduct();
            this.product = this.productService.product;
            this.loadingService.setLoading(false);
            this.isLoading = false;
          });
        } // else Register
      });
    this.subscriptions.push(routeSubscription);
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  togglePanel(expanded) {
    expanded = !expanded;
  }

  getProductDetails(newType?: string): void {
    if (this.id != null) {
      const id = this.id.toString();
      this.productService.getProduct(id).subscribe(response => {
        if (response) {

          // before copy the existing product, delete the ids
          if (newType && newType === 'copy') {
            this.scrub(response);
          }
          this.productService.loadProduct(response);
          this.product = this.productService.product;
          // Check if there is not Product Code Object, create one
          if (this.product.productCodeList.length == 0) {
            this.product.productCodeList = [{}];
          }
          let prodCode = '';
          if (this.product.productCodeList.length > 0) {
            for (let codeObj of this.product.productCodeList) {
              if (codeObj) {
                if (codeObj.productCode) {
                  prodCode = codeObj.productCode;
                  break;
                }
              }
            }
          }
        } else {
          this.message = 'No Product Record found for Id ' + this.id;
        }
        this.loadingService.setLoading(false);
        this.isLoading = false;
      }, error => {
        this.message = 'No Product Record found for Id ' + this.id;
        this.gaService.sendException('getProductDetails: error from API call');
        this.loadingService.setLoading(false);
        this.isLoading = false;
       // this.handleProductRetrivalError();
      });
    }
  }

  validate(validationType?: string): void {
    this.isLoading = true;
    this.serverError = false;
    this.loadingService.setLoading(true);

    this.validateClient();
    // If there is no error on client side, check validation on server side
    if (this.validationMessages.length === 0) {
      this.showSubmissionMessages = false;
      this.productService.validateProduct().pipe(take(1)).subscribe(results => {
        this.submissionMessage = null;
        this.validationMessages = results.validationMessages.filter(
          message => message.messageType.toUpperCase() === 'ERROR' || message.messageType.toUpperCase() === 'WARNING');
        this.validationResult = results.valid;
        this.showSubmissionMessages = true;
        this.loadingService.setLoading(false);
        this.isLoading = false;
        if (this.validationMessages.length === 0 && results.valid === true) {
          this.submissionMessage = 'Product is Valid. Would you like to submit?';
        }
      }, error => {
        this.addServerError(error);
        this.loadingService.setLoading(false);
        this.isLoading = false;
      });
    }
  }

  setValidationMessage(message: string) {
    const validate: ValidationMessage = {};
    validate.message = message;
    validate.messageType = 'ERROR';
    this.validationMessages.push(validate);
    this.validationResult = false;
  }

  // Validate data in client side first
  validateClient(): void {
    this.submissionMessage = null;
    this.validationMessages = [];
    this.validationResult = true;

    // Validate Expiry Date in Lot
    if ((this.expiryDateMessage !== null) && (this.expiryDateMessage.length > 0)) {
      this.setValidationMessage(this.expiryDateMessage);
    }

    // Validate Manufacture Date in Lot
    if ((this.manufactureDateMessage !== null) && (this.manufactureDateMessage.length > 0)) {
      this.setValidationMessage(this.manufactureDateMessage);
    }

    // Validate Ingredient Average, which should be integer/number
    if (this.product != null) {
      this.product.productComponentList.forEach(elementComp => {
        if (elementComp != null) {
          elementComp.productLotList.forEach(elementLot => {
            if (elementLot != null) {

              // Validate Ingredient Average, Low, High, LowLimit, HighLimit should be integer/number
              elementLot.productIngredientList.forEach(elementIngred => {
                if (elementIngred != null) {
                  if (elementIngred.average) {
                    if (this.isNumber(elementIngred.average) === false) {
                      this.setValidationMessage('Average must be a number');
                    }
                  }
                  if (elementIngred.low) {
                    if (this.isNumber(elementIngred.low) === false) {
                      this.setValidationMessage('Low must be a number');
                    }
                  }
                  if (elementIngred.high) {
                    if (this.isNumber(elementIngred.high) === false) {
                      this.setValidationMessage('High must be a number');
                    }
                  }
                  // Ingredient Name Validation
                  if (elementIngred.$$ingredientNameValidation) {
                    this.setValidationMessage(elementIngred.$$ingredientNameValidation);
                  }
                  // Basis of Strength Validation
                  if (elementIngred.$$basisOfStrengthValidation) {
                    this.setValidationMessage(elementIngred.$$basisOfStrengthValidation);
                  }
                }
              });
            }
          });
        }
      });
    }

    if (this.validationMessages.length > 0) {
      this.showSubmissionMessages = true;
      this.loadingService.setLoading(false);
      this.isLoading = false;
    }

  }

  toggleValidation(): void {
    this.showSubmissionMessages = !this.showSubmissionMessages;
  }

  addServerError(error: any): void {
    this.serverError = true;
    this.validationResult = false;
    this.validationMessages = null;

    const message: ValidationMessage = {
      actionType: 'server failure',
      links: [],
      appliedChange: false,
      suggestedChange: false,
      messageType: 'ERROR',
      message: 'Unknown Server Error'
    };
    if (error && error.error && error.error.message) {
      message.message = 'Server Error ' + (error.status + ': ' || ': ') + error.error.message;
    } else if (error && error.error && (typeof error.error) === 'string') {
      message.message = 'Server Error ' + (error.status + ': ' || '') + error.error;
    } else if (error && error.message) {
      message.message = 'Server Error ' + (error.status + ': ' || '') + error.message;
    }
    this.validationMessages = [message];
    this.showSubmissionMessages = true;
  }

  submit(): void {
    this.isLoading = true;
    this.loadingService.setLoading(true);
    // remove non-field form property/field/key from Product object
    this.product = this.cleanProduct();
    if (this.product) {
      if (this.product.id) {
      } else {
        if (this.product.provenance === null || this.product.provenance === undefined) {
          // Set Provenance to GSRS
          this.product.provenance = 'GSRS';
        }
      }
      // Set service application
      this.productService.product = this.product;
    }
    this.productService.saveProduct().subscribe(response => {
      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.validationMessages = null;
      this.submissionMessage = 'Product was saved successfully!';
      this.showSubmissionMessages = true;
      this.validationResult = false;
      setTimeout(() => {
        this.showSubmissionMessages = false;
        this.submissionMessage = '';
        if (response.id) {
          this.productService.bypassUpdateCheck();
          const id = response.id;
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/product', id, 'edit']);
        }
      }, 4000);
    }
      /*
      , (error: SubstanceFormResults) => {
        this.showSubmissionMessages = true;
        this.loadingService.setLoading(false);
        this.isLoading = false;
        this.submissionMessage = null;
        if (error.validationMessages && error.validationMessages.length) {
          this.validationResult = error.isSuccessfull;
          this.validationMessages = error.validationMessages
            .filter(message => message.messageType.toUpperCase() === 'ERROR' || message.messageType.toUpperCase() === 'WARNING');
          this.showSubmissionMessages = true;
        } else {
          this.submissionMessage = 'There was a problem with your submission';
          this.addServerError(error.serverError);
          setTimeout(() => {
            this.showSubmissionMessages = false;
            this.submissionMessage = null;
          }, 8000);
        }
      }*/
    );
  }

  private handleProductRetrivalError() {
    const notification: AppNotification = {
      message: 'The product you\'re trying to edit doesn\'t exist.',
      type: NotificationType.error,
      milisecondsToShow: 4000
    };
    this.mainNotificationService.setNotification(notification);
    setTimeout(() => {
      this.router.navigate(['/product/register']);
      this.productService.loadProduct();
    }, 5000);
  }

  cleanProduct(): Product {
    let productStr = JSON.stringify(this.product);
    let productCopy: Product = JSON.parse(productStr);
    productCopy.productComponentList.forEach(elementComp => {
      if (elementComp != null) {
        elementComp.productLotList.forEach(elementLot => {
          if (elementLot != null) {
            elementLot.productIngredientList.forEach(elementIngred => {
              if (elementIngred != null) {
                // remove property for Ingredient Name Validation. Do not need in the form JSON
                if (elementIngred.$$ingredientNameValidation || elementIngred.$$ingredientNameValidation === "") {
                  delete elementIngred.$$ingredientNameValidation;
                }
                // remove property for Basis of Strength Validation. Do not need in the form JSON
                if (elementIngred.$$basisOfStrengthValidation || elementIngred.$$basisOfStrengthValidation === "") {
                  delete elementIngred.$$basisOfStrengthValidation;
                }
              } // if ingred is not null
            }); // ingred loop
          } // if lot is not null
        }); // lot loop
      } // if comp is not null
    }); // comp loop

    return productCopy;
  }

  showJSON(): void {
    this.product = this.cleanProduct();
    const dialogRef = this.dialog.open(JsonDialogFdaComponent, {
      width: '90%',
      height: '90%',
      data: this.product
    });

    // this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
    });
    this.subscriptions.push(dialogSubscription);

  }

  saveJSON(): void {
    // apply the same cleaning to remove deleted objects and return what will be sent to the server on validation / submission
    this.cleanProduct();
    let json = this.product;
    // this.json = this.cleanObject(substanceCopy);
    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(json)));
    this.downloadJsonHref = uri;

    const date = new Date();
    this.jsonFileName = 'product_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');
  }

  importJSON(): void {
    let data: any;
    data = {
      title: 'Product Record Import',
      entity: 'product',
    };
    const dialogRef = this.dialog.open(SubstanceEditImportDialogComponent, {
      width: '650px',
      autoFocus: false,
      data: data
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
      if (response) {
        this.loadingService.setLoading(true);
        this.overlayContainer.style.zIndex = null;

        // attempting to reload a substance without a router refresh has proven to cause issues with the relationship dropdowns
        // There are probably other components affected. There is an issue with subscriptions likely due to some OnInit not firing

        /* const read = JSON.parse(response);
         if (this.id && read.uuid && this.id === read.uuid) {
           this.substanceFormService.importSubstance(read, 'update');
           this.submissionMessage = null;
           this.validationMessages = [];
           this.showSubmissionMessages = false;
           this.loadingService.setLoading(false);
           this.isLoading = false;
         } else {
         if ( read.substanceClass === this.substanceClass) {
           this.imported = true;
           this.substanceFormService.importSubstance(read);
           this.submissionMessage = null;
           this.validationMessages = [];
           this.showSubmissionMessages = false;
           this.loadingService.setLoading(false);
           this.isLoading = false;
         } else {*/
        setTimeout(() => {
          this.router.onSameUrlNavigation = 'reload';
          this.loadingService.setLoading(false);
          if (!this.id) {
            // new record
            this.router.navigateByUrl('/product/register?action=import', { state: { record: response } });
          }
        }, 1000);
      }
      // }
      // }
    });
  }

  confirmDeleteProduct(productId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete this Product?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteProduct(productId);
      }
    });
  }

  deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId).subscribe(response => {
      this.productService.bypassUpdateCheck();
      this.displayMessageAfterDeleteProd();
    }, (err) => {
      console.log(err);
    }
    );
  }

  displayMessageAfterDeleteProd() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'This product record was deleted successfully',
        type: 'home'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/home']);
    });
  }

  addNewProductName() {
    this.productService.addNewProductName();
  }

  confirmDeleteProductName(prodNameIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Product Name ' + (prodNameIndex + 1) + ' ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteProductName(prodNameIndex);
      }
    });
  }

  deleteProductName(prodNameIndex: number) {
    this.productService.deleteProductName(prodNameIndex);
  }

  addNewTermAndTermPart(prodNameIndex: number) {
    this.productService.addNewTermAndTermPart(prodNameIndex);
  }

  confirmDeleteTermAndTermPart(prodNameIndex: number, prodNameTermIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Term and Term Part ' + (prodNameTermIndex + 1) + ' ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteTermAndTermPart(prodNameIndex, prodNameTermIndex);
      }
    });
  }

  deleteTermAndTermPart(prodNameIndex: number, prodNameTermIndex: number) {
    this.productService.deleteTermAndTermPart(prodNameIndex, prodNameTermIndex);
  }

  addNewProductCode() {
    this.productService.addNewProductCode();
  }

  confirmDeleteProductCode(prodCodeIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Product Code ' + (prodCodeIndex + 1) + ' ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteProductCode(prodCodeIndex);
      }
    });
  }

  deleteProductCode(prodCodeIndex: number) {
    this.productService.deleteProductCode(prodCodeIndex);
  }

  addNewProductCompany() {
    this.productService.addNewProductCompany();
  }

  confirmDeleteProductCompany(prodCompanyIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Product Company ' + (prodCompanyIndex + 1) + ' ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteProductCompany(prodCompanyIndex);
      }
    });
  }

  deleteProductCompany(prodCompanyIndex: number) {
    this.productService.deleteProductCompany(prodCompanyIndex);
  }

  addNewProductCompanyCode(productCompanyIndex: number) {
    this.productService.addNewProductCompanyCode(productCompanyIndex);
  }

  confirmDeleteProductCompanyCode(prodCompanyIndex: number, prodCompanyCodeIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Product Company Code ' + (prodCompanyCodeIndex + 1) + ' ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteProductCompanyCode(prodCompanyIndex, prodCompanyCodeIndex);
      }
    });
  }

  deleteProductCompanyCode(prodCompanyIndex: number, prodCompanyCodeIndex: number) {
    this.productService.deleteProductCompanyCode(prodCompanyIndex, prodCompanyCodeIndex);
  }

  addNewProductComponent() {
    this.productService.addNewProductComponent();
  }

  expiryDateMessageOutChange($event) {
    this.expiryDateMessage = $event;
  }

  manufactureDateMessageOutChange($event) {
    this.manufactureDateMessage = $event;
  }

  isNumber(str: any): boolean {
    if (str) {
      const num = Number(str);
      const nan = isNaN(num);
      return !nan;
    }
    return false;
  }

  getViewProductUrl(): string {
    return this.productService.getViewProductUrl(this.id);
  }

  scrub(oldraw: any): any {
    const old = oldraw;
    const idHolders = defiant.json.search(old, '//*[id]');
    for (let i = 0; i < idHolders.length; i++) {
      if (idHolders[i].id) {
        delete idHolders[i].id;
      }
    }

    const createHolders = defiant.json.search(old, '//*[creationDate]');
    for (let i = 0; i < createHolders.length; i++) {
      delete createHolders[i].creationDate;
    }

    const createdByHolders = defiant.json.search(old, '//*[createdBy]');
    for (let i = 0; i < createdByHolders.length; i++) {
      delete createdByHolders[i].createdBy;
    }

    const modifyHolders = defiant.json.search(old, '//*[lastModifiedDate]');
    for (let i = 0; i < modifyHolders.length; i++) {
      delete modifyHolders[i].lastModifiedDate;
    }

    const modifiedByHolders = defiant.json.search(old, '//*[modifiedBy]');
    for (let i = 0; i < modifiedByHolders.length; i++) {
      delete modifiedByHolders[i].modifiedBy;
    }

    const intVersionHolders = defiant.json.search(old, '//*[internalVersion]');
    for (let i = 0; i < intVersionHolders.length; i++) {
      delete intVersionHolders[i].internalVersion;
    }

    delete old['creationDate'];
    delete old['createdBy'];
    delete old['modifiedBy'];
    delete old['lastModifiedDate'];
    delete old['internalVersion'];
    delete old['$$update'];

    return old;
  }
}
