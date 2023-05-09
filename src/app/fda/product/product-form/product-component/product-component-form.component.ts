import { Component, OnInit, Input, AfterViewInit, OnDestroy, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '@gsrs-core/controlled-vocabulary/vocabulary.model';
import { Product, ProductComponent, ValidationMessage } from '../../model/product.model';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { JsonDialogFdaComponent } from '../../../json-dialog-fda/json-dialog-fda.component';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-component-form',
  templateUrl: './product-component-form.component.html',
  styleUrls: ['./product-component-form.component.scss']
})
export class ProductComponentFormComponent implements OnInit {

  @Input() productComponent: ProductComponent;
  @Input() totalComponent: number;
  @Input() prodComponentIndex: number;
  @Output() expiryDateMessageOut = new EventEmitter<string>();
  @Output() manufactureDateMessageOut = new EventEmitter<string>();

  /*
  dosageFormList: Array<VocabularyTerm> = [];
  colorList: Array<VocabularyTerm> = [];
  flavorList: Array<VocabularyTerm> = [];
  shapeList: Array<VocabularyTerm> = [];
  scoringList: Array<VocabularyTerm> = [];
  reviewProductMessage: Array<any> = [];
  */
  productMessage = '';
  username = null;
  expiryDateMessage = '';
  manufactureDateMessage = '';

  constructor(
    private productService: ProductService,
    public cvService: ControlledVocabularyService,
    private authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.username = this.authService.getUser();
  }

  addNewProductManufacturer(prodComponentIndex: number) {
    this.productService.addNewProductManufacturer(prodComponentIndex);
  }

  addNewProductLot(prodComponentIndex: number) {
    this.productService.addNewProductLot(prodComponentIndex);
  }

  confirmDeleteComponent(prodComponentIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Manufacture Item Details ' + (prodComponentIndex + 1) + ' data?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteProductComponent(prodComponentIndex);
      }
    });
  }

  deleteProductComponent(prodComponentIndex: number) {
    this.productService.deleteProductComponent(prodComponentIndex);
  }

  confirmDeleteProductManufacturer(prodComponentIndex: number, productManuIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {message: 'Are you sure you want to delete Manufacture Item Code ' + (productManuIndex + 1) + ' data?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteProductManufacturer(prodComponentIndex, productManuIndex);
      }
    });
  }

  deleteProductManufacturer(prodComponentIndex: number, productManuIndex: number) {
    this.productService.deleteProductManufacturer(prodComponentIndex, productManuIndex);
  }

  copyProductComponent() {
    this.productService.copyProductComponent(this.productComponent);
  }

  /*
  confirmDeleteProduct(prodIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure you want to delete Product Details ' + (prodIndex + 1) + ' data?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteProduct(prodIndex);
      }
    });
  }

  deleteProduct(prodIndex: number) {
    this.applicationService.deleteProduct(prodIndex);
  }


  confirmDeleteProductName(prodIndex: number, prodNameIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure you want to delete Product Name ' + (prodNameIndex + 1) + ' ?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteProductName(prodIndex, prodNameIndex);
      }
    });
  }

  deleteProductName(prodIndex: number, prodNameIndex: number) {
    this.applicationService.deleteProductName(prodIndex, prodNameIndex);
  }

  copyProduct(product: any) {
    this.applicationService.copyProduct(product);
  }

  confirmReviewProduct(prodIndex: number) {
    if (this.application.applicationProductList[prodIndex].reviewDate) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: 'Are you sure you want to overwrite Reviewed By and Review Date?'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result === true) {
          this.reviewProduct(prodIndex);
        }
      });
    } else {
      this.reviewProduct(prodIndex);
    }
  }

  reviewProduct(prodIndex: number) {
    this.applicationService.getCurrentDate().subscribe(response => {
      if (response) {
        this.application.applicationProductList[prodIndex].reviewDate = response.date;
        this.application.applicationProductList[prodIndex].reviewedBy = this.username;
      }
    });
  }

  addNewIngredient(prodIndex: number) {
    this.applicationService.addNewIngredient(prodIndex);
  }
*/

  expiryDateMessageOutChange($event) {
    this.expiryDateMessage = $event;
    this.expiryDateMessageOut.emit(this.expiryDateMessage);
  }

  manufactureDateMessageOutChange($event) {
    this.manufactureDateMessage = $event;
    this.manufactureDateMessageOut.emit(this.manufactureDateMessage);
  }

}
