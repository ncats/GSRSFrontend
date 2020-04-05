import { Component, OnInit, Input } from '@angular/core';
import { ProductSrs, ApplicationIngredient } from '../../model/application.model';
import { ControlledVocabularyService } from '../../../../core/controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../../../core/controlled-vocabulary/vocabulary.model';
import { ApplicationService } from '../../service/application.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SubstanceRelated, SubstanceSummary } from '@gsrs-core/substance';

@Component({
  selector: 'app-ingredient-form',
  templateUrl: './ingredient-form.component.html',
  styleUrls: ['./ingredient-form.component.scss']
})
export class IngredientFormComponent implements OnInit {

  @Input() applicationIngredientList: Array<ApplicationIngredient> = [];
  @Input() prodIndex: number;
  ingredientTypeList: Array<VocabularyTerm> = [];
  unitList: Array<VocabularyTerm> = [];
  gradeList: Array<VocabularyTerm> = [];
  reviewIngredientMessage: Array<any> = [];
  ingredientMessage = '';
  parent: SubstanceRelated;
  relatedSubstanceUuid: string;
  relatedBasisSubstanceUuid: string;

  constructor(
    private applicationService: ApplicationService,
    public cvService: ControlledVocabularyService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.getVocabularies();
    // this.getSubstanceDetails('0007647AA');
    this.relatedSubstanceUuid = '41ae991d-b3fc-487c-a707-5903d9cb2aef';
    this.relatedBasisSubstanceUuid = '5ef28fe9-ad6f-4593-a3de-22b0b16ad0e6';
  }

  /*
  @Input()
  set product(product: ProductSrs) {
    this.product = product;
    if (this.product.)
    this.privateConstituent = constituent;
    if (this.constituent.substance) {
      this.relatedSubstanceUuid = this.privateConstituent.substance.refuuid;
    }

  }
*/

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('INGREDIENT_TYPE', 'PROD_UNIT', 'PROD_GRADE').subscribe(response => {
      this.ingredientTypeList = response['INGREDIENT_TYPE'].list;
      this.unitList = response['PROD_UNIT'].list;
      this.gradeList = response['PROD_GRADE'].list;
    });
  }

  getSubstanceDetails(bdnum: string): string {
    const substanceUuid = '';
    /*
    if (bdnum != null) {
      this.applicationService.getSubstanceDetailsByBdnum(bdnum).subscribe(response => {
        if (response) {
          console.log('bdnum: ' + JSON.stringify(response));
          this.relatedSubstanceUuid = response.substanceId;
          console.log(response.substanceId);
          return 'response.substanceId';
        }
      });
    }
    */
    return 'ec99c48c-91bf-4699-9ab3-2c5ff7aeb9a6';
  }


  addNewIngredient(prodIndex: number) {
    this.applicationService.addNewIngredient(prodIndex);
  }

  confirmDeleteIngredient(prodIndex: number, ingredIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure you want to delete Ingredient Details ' + (ingredIndex + 1) + ' data?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        console.log(result);
        this.deleteIngredient(prodIndex, ingredIndex);
      }
    });
  }

  deleteIngredient(prodIndex: number, ingredIndex: number) {
    this.applicationService.deleteIngredient(prodIndex, ingredIndex);
  }

  copyIngredient(ingredient: any, prodIndex) {
    this.applicationService.copyIngredient(ingredient, prodIndex);
  }

  reviewIngredient(ingredient: any, prodIndex, ingredIndex: number) {
    this.reviewIngredientMessage[prodIndex] = new Date();
    this.applicationService.reviewIngredient(prodIndex, ingredIndex);
    // const dateFormat = require('dateformat');
    //  const now = new Date();
    //  dateFormat(now, 'dddd, mmmm dS, yyyy, h:MM:ss TT');
    //  console.log('DATE: ' + now);
  }

  ingredientNameUpdated(substance: SubstanceSummary, ingredIndex: number): void {
    const relatedSubstance: SubstanceRelated = {
      refPname: substance._name,
      name: substance._name,
      refuuid: substance.uuid,
      substanceClass: 'reference',
      approvalID: substance.approvalID
    };
    console.log('REL SUB: ' + relatedSubstance.refuuid);
    // this.component.substance = relatedSubstance;
    //  this.relatedSubstanceUuid = this.component.substance.refuuid;
  }

  basisOfStrengthUpdated(substance: SubstanceSummary): void {
    const relatedSubstance: SubstanceRelated = {
      refPname: substance._name,
      name: substance._name,
      refuuid: substance.uuid,
      substanceClass: 'reference',
      approvalID: substance.approvalID
    };
    console.log('REL SUB Basis: ' + relatedSubstance.refuuid);

    // this.component.substance = relatedSubstance;
    //  this.relatedSubstanceUuid = this.component.substance.refuuid;
  }


}
