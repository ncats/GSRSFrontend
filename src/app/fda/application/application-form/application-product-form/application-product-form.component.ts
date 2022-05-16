import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Application } from '../../model/application.model';
import { ControlledVocabularyService } from '../../../../core/controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../../../core/controlled-vocabulary/vocabulary.model';
import { ApplicationService } from '../../service/application.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { GeneralService } from 'src/app/fda/service/general.service';

@Component({
  selector: 'app-application-product-form',
  templateUrl: './application-product-form.component.html',
  styleUrls: ['./application-product-form.component.scss']
})
export class ApplicationProductFormComponent implements OnInit {

  @Input() application: Application;
  @Output() ingredientMessageOut = new EventEmitter<String>();
  @Output() basisOfStrengthMessageOut = new EventEmitter<String>();

  reviewProductMessage: Array<any> = [];
  productMessage = '';
  username = null;

  constructor(
    private applicationService: ApplicationService,
    public cvService: ControlledVocabularyService,
    private authService: AuthService,
    private generalService: GeneralService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.username = this.authService.getUser();
  }

  addNewProduct() {
    this.applicationService.addNewProduct();
  }

  addNewProductName(prodIndex: number) {
    this.applicationService.addNewProductName(prodIndex);
  }

  confirmDeleteProduct(prodIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Product Details ' + (prodIndex + 1) + ' data?' }
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
      data: { message: 'Are you sure you want to delete Product Name ' + (prodNameIndex + 1) + ' ?' }
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
        data: { message: 'Are you sure you want to overwrite Reviewed By and Review Date?' }
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
    const currentDate = this.generalService.getCurrentDate();
    this.application.applicationProductList[prodIndex].reviewDate = currentDate;
    this.application.applicationProductList[prodIndex].reviewedBy = this.username;
  }

  addNewIngredient(prodIndex: number) {
    this.applicationService.addNewIngredient(prodIndex);
  }

  /*
  loadRouteAdmin() {
    this.application.applicationProductList.forEach((elementProd, prodIndex) => {
      if (elementProd != null) {
        if (elementProd.routeAdmin) {
        }
      }
    });
  }
  */

  updateRouteAdmin(routeAdmins: Array<string>, prodIndex: number): void {
    this.application.applicationProductList[prodIndex].routeAdmin = routeAdmins.toString();
  }

  ingredientMessageOutChange($event) {
     this.ingredientMessageOut.emit($event);
  }

  basisOfStrengthMessageOutChange($event) {
    this.basisOfStrengthMessageOut.emit($event);
  }
}
