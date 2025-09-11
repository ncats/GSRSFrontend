import { Component, OnInit, Input, AfterViewInit, OnDestroy, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import * as moment from 'moment';

/* GSRS Core Imports */
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary/controlled-vocabulary.service';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { VocabularyTerm } from '@gsrs-core/controlled-vocabulary/vocabulary.model';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';

/* GSRS Product Imports */
import { ProductService } from '../../service/product.service';
import { ProductLot, ValidationMessage } from '../../model/product.model';
import { formatDate } from '@angular/common';

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
  @Output() expiryDateMessageOut = new EventEmitter<string>();
  @Output() manufactureDateMessageOut = new EventEmitter<string>();

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
  overlayContainer: HTMLElement;

  constructor(
    private productService: ProductService,
    public cvService: ControlledVocabularyService,
    private authService: AuthService,
    private overlayContainerService: OverlayContainer,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    this.username = this.authService.getUser();

    this.getLotDetails();
  }

  getLotDetails() {
    // If updating record, load date fields in the Datepicker Input Textbox
    if (this.productLot != null) {
      if (this.productLot.id != null) {

        if (this.productLot.expiryDate) {
          // Load/Assign 'Expiry Date' value on the DatePicker Input textbox
          this.productLot._expiryDate = new Date(this.productLot.expiryDate);
        }

        if (this.productLot.manufactureDate) {
          // Load/Assign 'Manufacture Date' value on the DatePicker Input textbox
          this.productLot._manufactureDate = new Date(this.productLot.manufactureDate);
        }

      }
    }
  }

  confirmDeleteProductLot(prodComponentIndex: number, prodLotIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Product Lot Details ' + (prodLotIndex + 1) + ' data?' }
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
      this.expiryDateMessage = 'Expiry Date is invalid in Manufacture Item ' + (this.prodComponentIndex + 1) + ' in Lot ' + (this.prodLotIndex + 1);
    }
    this.expiryDateMessageOut.emit(this.expiryDateMessage);
  }

  validateManufactureDate() {
    this.manufactureDateMessage = '';
    const isValid = this.validateDate(this.productLot.manufactureDate);
    if (isValid === false) {
      this.manufactureDateMessage = 'Manufacture Date is invalid in Manufacture Item ' + (this.prodComponentIndex + 1) + ' in Lot ' + (this.prodLotIndex + 1);
    }
    this.manufactureDateMessageOut.emit(this.manufactureDateMessage);
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

  changeExpiryDate(event: MatDatepickerInputEvent<Date>): void {
    const inputElement: HTMLElement = event.targetElement;
    const inputValue: any = (inputElement as HTMLInputElement).value;

    this.productLot.expiryDate = inputValue;

    this.validateExpiryDate();
  }

  changeManufactureDate(event: MatDatepickerInputEvent<Date>): void {
    const inputElement: HTMLElement = event.targetElement;
    const inputValue: any = (inputElement as HTMLInputElement).value;

    this.productLot.manufactureDate = inputValue;

    this.validateManufactureDate();

  }

  increaseOverlayZindex(): void {
    this.overlayContainer.style.zIndex = '1002';
  }

  decreaseOverlayZindex(): void {
    this.overlayContainer.style.zIndex = null;
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
