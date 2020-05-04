import { Component, OnInit, Input, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
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

  dosageFormList: Array<VocabularyTerm> = [];
  colorList: Array<VocabularyTerm> = [];
  flavorList: Array<VocabularyTerm> = [];
  shapeList: Array<VocabularyTerm> = [];
  scoringList: Array<VocabularyTerm> = [];
  reviewProductMessage: Array<any> = [];
  productMessage = '';
  username = null;

  constructor(
    private productService: ProductService,
    public cvService: ControlledVocabularyService,
    private authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.username = this.authService.getUser();
    this.getVocabularies();
  }

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

  confirmDeleteProductLot(prodComponentIndex: number, prodLotIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure you want to delete Product Lot Details ' + (prodLotIndex + 1) + ' data?'
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

}
