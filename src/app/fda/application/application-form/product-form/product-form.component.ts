import { Component, OnInit, Input } from '@angular/core';
import { ApplicationSrs } from '../../model/application.model';
import { ControlledVocabularyService } from '../../../../core/controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../../../core/controlled-vocabulary/vocabulary.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  @Input() application: ApplicationSrs;
  dosageFormList: Array<VocabularyTerm> = [];
  routeAdminList: Array<VocabularyTerm> = [];
  unitPresentationList: Array<VocabularyTerm> = [];
  unitList: Array<VocabularyTerm> = [];

  constructor(
    public cvService: ControlledVocabularyService) { }

  ngOnInit() {
    this.getVocabularies();
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('DOSAGE_FORM', 'PROD_ROUTE_OF_ADMIN','PROD_UNIT_PRESENTATION', 'APPLICATION_UNIT').subscribe(response => {
      this.dosageFormList = response['DOSAGE_FORM'].list;
      this.routeAdminList = response['PROD_ROUTE_OF_ADMIN'].list;
      this.unitPresentationList = response['PROD_UNIT_PRESENTATION'].list;
      this.unitList = response['APPLICATION_UNIT'].list;
    });
  }

}
