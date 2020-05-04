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
  styleUrls: ['./product-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ProductFormComponent implements OnInit, AfterViewInit, OnDestroy {

  product: Product;
  productNameTypeList: Array<VocabularyTerm> = [];
  productTermPartList: Array<VocabularyTerm> = [];
  pharmacedicalDosageFormList: Array<VocabularyTerm> = [];
  releaseCharacteristicList: Array<VocabularyTerm> = [];
  countryCodeList: Array<VocabularyTerm> = [];
  languageList: Array<VocabularyTerm> = [];
  productTypeList: Array<VocabularyTerm> = [];
  statusList: Array<VocabularyTerm> = [];
  publicDomainList: Array<VocabularyTerm> = [];
  sourceTypeList: Array<VocabularyTerm> = [];
  unitPresentationList: Array<VocabularyTerm> = [];
  routeOfAdministrationList: Array<VocabularyTerm> = [];
  applicationTypeList: Array<VocabularyTerm> = [];
  productCodeTypeList: Array<VocabularyTerm> = [];
  productCompanyRoleList: Array<VocabularyTerm> = [];
  companyCodeTypeList: Array<VocabularyTerm> = [];

  id?: number;
  isLoading = true;
  showSubmissionMessages = false;
  submissionMessage: string;
  validationMessages: Array<ValidationMessage>;
  validationResult = false;
  private subscriptions: Array<Subscription> = [];
  copy: string;
  private overlayContainer: HTMLElement;
  serverError: boolean;
  isDisableData = false;
  username = null;
  title = null;

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
            this.gaService.sendPageView(`Application Edit`);
            this.getProductDetails();
            this.getVocabularies();
          }
        } else {
          this.title = 'Register New Product';
          setTimeout(() => {
            this.gaService.sendPageView(`Application Register`);
            this.productService.loadProduct();
            this.product = this.productService.product;
            this.getVocabularies();
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
    // this.applicationService.unloadSubstance();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('PROD_PRODUCT_NAME_TYPE', 'PROD_PHARMACEDICAL_DOSAGE_FORM',
    'PROD_RELEASE_CHARACTERISTIC', 'PROD_COUNTRY_CODE', 'LANGUAGE', 'PROD_PRODUCT_TYPE',
    'PROD_STATUS', 'PUBLIC_DOMAIN').subscribe(response => {
      this.productNameTypeList = response['PROD_PRODUCT_NAME_TYPE'].list;
  //    this.productTermPartList = response['PROD_TERM_PART'].list;
      this.pharmacedicalDosageFormList = response['PROD_PHARMACEDICAL_DOSAGE_FORM'].list;
      this.releaseCharacteristicList =  response['PROD_RELEASE_CHARACTERISTIC'].list;
      this.countryCodeList =  response['PROD_COUNTRY_CODE'].list;
      this.languageList =  response['LANGUAGE'].list;
      this.productTypeList = response['PROD_PRODUCT_TYPE'].list;
      this.statusList =  response['PROD_STATUS'].list;
      this.publicDomainList = response['PUBLIC_DOMAIN'].list;
    });

    this.cvService.getDomainVocabulary('PROD_SOURCE_TYPE', 'PROD_UNIT_PRESENTATION',
    'PROD_ROUTE_OF_ADMIN', 'APPLICATION_TYPE', 'PROD_PRODUCT_CODE_TYPE',
    'PROD_COMPANY_ROLE', 'PROD_COMPANY_CODE_TYPE').subscribe(response => {
      this.sourceTypeList = response['PROD_SOURCE_TYPE'].list;
      this.unitPresentationList = response['PROD_UNIT_PRESENTATION'].list;
      this.routeOfAdministrationList = response['PROD_ROUTE_OF_ADMIN'].list;
      this.applicationTypeList = response['APPLICATION_TYPE'].list;
      this.productCodeTypeList = response['PROD_PRODUCT_CODE_TYPE'].list;
      this.productCompanyRoleList = response['PROD_COMPANY_ROLE'].list;
      this.companyCodeTypeList = response['PROD_COMPANY_CODE_TYPE'].list;
    });

    this.cvService.getDomainVocabulary('PROD_TERM_PART').subscribe(response => {
      this.productTermPartList = response['PROD_TERM_PART'].list;
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
        this.gaService.sendException('getApplicationDetails: error from API call');
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
      this.submissionMessage = 'Application was saved successfully!';
      this.showSubmissionMessages = true;
      this.validationResult = false;
      setTimeout(() => {
        this.showSubmissionMessages = false;
        this.submissionMessage = '';
        if (response.id) {
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

  addNewProductName() {
    this.productService.addNewProductName();
  }

  confirmDeleteProductName(prodNameIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure you want to delete Product Name ' + (prodNameIndex + 1) + ' ?'
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
      data: 'Are you sure you want to delete Term and Term Part ' + (prodNameTermIndex + 1) + ' ?'
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
      data: 'Are you sure you want to delete Product Code ' + (prodCodeIndex + 1) + ' ?'
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
      data: 'Are you sure you want to delete Product Company ' + (prodCompanyIndex + 1) + ' ?'
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

  /*
  addNewIndication() {
    this.applicationService.addNewIndication();
  }

  confirmDeleteIndication(indIndex: number, indication: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure you want to delete Indication (' + (indIndex + 1) + ')?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        console.log(result);
        this.deleteIndication(indIndex);
      }
    });
  }

  deleteIndication(indIndex: number) {
    this.applicationService.deleteIndication(indIndex);
  }
*/
}
