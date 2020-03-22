import { Component, OnInit, Input } from '@angular/core';
import { ApplicationSrs } from '../../model/application.model';
import { ControlledVocabularyService } from '../../../../core/controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../../../core/controlled-vocabulary/vocabulary.model';
import { ApplicationService } from '../../service/application.service';

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

  constructor(
    private applicationService: ApplicationService,
    public cvService: ControlledVocabularyService) { }

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

}
