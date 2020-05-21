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
import { ProductLot, ValidationMessage } from '../../model/product.model';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { JsonDialogFdaComponent } from '../../../json-dialog-fda/json-dialog-fda.component';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-lot-form',
  templateUrl: './product-lot-form.component.html',
  styleUrls: ['./product-lot-form.component.scss']
})
export class ProductLotFormComponent implements OnInit {

  @Input() productLot: ProductLot;
  @Input() totalLot: number;
  @Input() prodLotIndex: number;
  @Input() prodComponentIndex: number;
//  @Output() expiryDateMessageOut: EventEmitter<any> = new EventEmitter<any>();

  dosageFormList: Array<VocabularyTerm> = [];
  colorList: Array<VocabularyTerm> = [];
  flavorList: Array<VocabularyTerm> = [];
  shapeList: Array<VocabularyTerm> = [];
  scoringList: Array<VocabularyTerm> = [];
  reviewProductMessage: Array<any> = [];
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
  //  this.getVocabularies();
  }

  /*
  getVocabularies(): void {
    this.cvService.getDomainVocabulary('DOSAGE_FORM', 'PROD_CHARACTER_COLOR', 'PROD_CHARACTER_FLAVOR',
      'PROD_CHARACTER_SHAPE', 'PROD_CHARACTER_FRAGMENTS').subscribe(response => {
        this.dosageFormList = response['DOSAGE_FORM'].list;
        this.colorList = response['PROD_CHARACTER_COLOR'].list;
        this.flavorList = response['PROD_CHARACTER_FLAVOR'].list;
        this.shapeList = response['PROD_CHARACTER_SHAPE'].list;
        this.scoringList = response['PROD_CHARACTER_FRAGMENTS'].list;
      });
  }
*/
  confirmDeleteProductLot(prodComponentIndex: number, prodLotIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {message: 'Are you sure you want to delete Product Lot Details ' + (prodLotIndex + 1) + ' data?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteProductLot(prodComponentIndex, prodLotIndex);
      }
    });
  }

  deleteProductLot(prodComponentIndex: number, prodLotIndex: number) {
    this.productService.deleteProductLot(prodComponentIndex, prodLotIndex);
  }

  addNewProductIngredient(prodComponentIndex: number, prodLotIndex: number) {
    this.productService.addNewProductIngredient(prodComponentIndex, prodLotIndex);
  }

  copyProductLot() {
    this.productService.copyProductLot(this.productLot, this.prodComponentIndex);
  }

  validateExpiryDate() {
    this.expiryDateMessage = '';
    const isValid = this.validateDate(this.productLot.expiryDate);
    if (isValid === false) {
      this.expiryDateMessage = 'Expiry Date is invalid';
    }
  //  this.expiryDateMessage.emit(this.expiryDateMessage);
  }

  validateManufactureDate() {
    this.manufactureDateMessage = '';
    const isValid = this.validateDate(this.productLot.manufactureDate);
    if (isValid === false) {
      this.manufactureDateMessage = 'Manufacture Date is invalid';
    }
  }

  validateDate(dateinput: any): boolean {
    let isValid = true;
    if ((dateinput !== null) && (dateinput.length > 0)) {
      if ((dateinput.length < 8) || (dateinput.length > 10)) {
        return false;
      }
      const split = dateinput.split('/');
      if (split.length !== 3 || (split[0].length < 1 || split[0].length > 2) ||
        (split[1].length < 1 || split[1].length > 2) || split[2].length !== 4) {
        return false;
      }
      if (split.length === 3) {
        const comstring = split[0] + split[1] + split[2];
        for (let i = 0; i < split.length; i++) {
          const valid = this.isNumber(split[i]);
          if (valid === false) {
            isValid = false;
            break;
          }
        }
      }
    }
    return isValid;
  }

  isNumber(str: string): boolean {
    if ((str !== null) && (str !== '')) {
      const num = Number(str);
      const nan = isNaN(num);
      return !nan;
    }
    return false;
  }

}
