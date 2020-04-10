import { Component, OnInit, Input } from '@angular/core';
import { ApplicationSrs } from '../../model/application.model';
import { ControlledVocabularyService } from '../../../../core/controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../../../core/controlled-vocabulary/vocabulary.model';
import { ApplicationService } from '../../service/application.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  @Input() application: ApplicationSrs;
  productNameTypeList: Array<VocabularyTerm> = [];
  dosageFormList: Array<VocabularyTerm> = [];
  routeAdminList: Array<VocabularyTerm> = [];
  unitPresentationList: Array<VocabularyTerm> = [];
  unitList: Array<VocabularyTerm> = [];
  reviewProductMessage: Array<any> = [];
  productMessage = '';

  constructor(
    private applicationService: ApplicationService,
    public cvService: ControlledVocabularyService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.getVocabularies();
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('PROD_PRODUCT_NAME_TYPE', 'DOSAGE_FORM', 'PROD_ROUTE_OF_ADMIN',
    'PROD_UNIT_PRESENTATION', 'APPLICATION_UNIT').subscribe(response => {
      this.productNameTypeList = response['PROD_PRODUCT_NAME_TYPE'].list;
      this.dosageFormList = response['DOSAGE_FORM'].list;
      this.routeAdminList = response['PROD_ROUTE_OF_ADMIN'].list;
      this.unitPresentationList = response['PROD_UNIT_PRESENTATION'].list;
      this.unitList = response['APPLICATION_UNIT'].list;
    });
  }

  addNewProduct() {
    this.applicationService.addNewProduct();
  }

  addNewProductName(prodIndex: number) {
    this.applicationService.addNewProductName(prodIndex);
  }

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

  reviewProduct(prodIndex: number) {
    this.reviewProductMessage[prodIndex] = new Date();
  }

  addNewIngredient(prodIndex: number) {
    this.applicationService.addNewIngredient(prodIndex);
  }

}
