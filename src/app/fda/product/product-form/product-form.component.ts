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
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
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
    private dialog: MatDialog) { }

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
            this.gaService.sendPageView(`Product Edit`);
            this.getProductDetails();
          }
        } else {
          this.title = 'Register New Product';
          setTimeout(() => {
            this.gaService.sendPageView(`Product Register`);
            this.productService.loadProduct();
            this.product = this.productService.product;
            this.loadingService.setLoading(false);
            this.isLoading = false;
          });
        }
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

  getProductDetails(newType?: string): void {
    if (this.id != null) {
      const id = this.id.toString();
      this.productService.getProduct(id, 'srs').subscribe(response => {
        if (response) {
          this.productService.loadProduct(response);
          this.product = this.productService.product;
        } else {
          this.handleProductRetrivalError();
        }
        this.loadingService.setLoading(false);
        this.isLoading = false;
      }, error => {
        this.gaService.sendException('getProductDetails: error from API call');
        this.loadingService.setLoading(false);
        this.isLoading = false;
        this.handleProductRetrivalError();
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

  showJSON(): void {
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

  confirmDeleteProduct() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete this Product?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteProduct();
      }
    });
  }

  deleteProduct(): void {
    this.productService.deleteProduct().subscribe(response => {
      if (response) {
        this.displayMessageAfterDeleteProd();
      }
    });
  }

  displayMessageAfterDeleteProd() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'This product record was successfully deleted',
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
}
