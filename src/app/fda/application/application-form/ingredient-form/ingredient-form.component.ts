import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ProductSrs, ApplicationIngredient } from '../../model/application.model';
import { ControlledVocabularyService } from '../../../../core/controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../../../core/controlled-vocabulary/vocabulary.model';
import { ApplicationService } from '../../service/application.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SubstanceRelated, SubstanceSummary } from '@gsrs-core/substance';
import { SubstanceSearchSelectorComponent } from '../../../substance-search-select/substance-search-selector.component';

@Component({
  selector: 'app-ingredient-form',
  templateUrl: './ingredient-form.component.html',
  styleUrls: ['./ingredient-form.component.scss']
})
export class IngredientFormComponent implements OnInit {
  @Input() ingredient: ApplicationIngredient;
  @Input() prodIndex: number;
  @Input() ingredIndex: number;
  @Input() totalIngredient: number;

  ingredientTypeList: Array<VocabularyTerm> = [];
  unitList: Array<VocabularyTerm> = [];
  gradeList: Array<VocabularyTerm> = [];
  // selectedSubstance?: SubstanceSummary = null;
  ingredientName: string;
  ingredientNameSubstanceUuid: string;
  ingredientNameMessage = '';
  basisOfStrengthName: string;
  basisofStrengthSubstanceUuid: string;
  basisOfStrengthMessage = '';

  constructor(
    private applicationService: ApplicationService,
    public cvService: ControlledVocabularyService,
    private dialog: MatDialog) { }

  ngOnInit() {
    setTimeout(() => {
      this.getVocabularies();
      this.getSubstanceId(this.ingredient.bdnum, 'ingredientname');
      this.getSubstanceId(this.ingredient.basisOfStrengthBdnum, 'basisofstrength');
    }, 600);
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('INGREDIENT_TYPE', 'PROD_UNIT', 'PROD_GRADE').subscribe(response => {
      this.ingredientTypeList = response['INGREDIENT_TYPE'].list;
      this.unitList = response['PROD_UNIT'].list;
      this.gradeList = response['PROD_GRADE'].list;
    });
  }

  addNewIngredient(prodIndex: number) {
    this.applicationService.addNewIngredient(prodIndex);
  }

  confirmDeleteIngredient(prodIndex: number, ingredIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure you want to delete Ingredient Details ' + (ingredIndex + 1) + '?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
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

  reviewIngredient(prodIndex: number, ingredIndex: number) {
 //   this.reviewIngredientMessage[prodIndex] = new Date();
    this.applicationService.reviewIngredient(prodIndex, ingredIndex);
    // const dateFormat = require('dateformat');
    //  const now = new Date();
    //  dateFormat(now, 'dddd, mmmm dS, yyyy, h:MM:ss TT');
    //  console.log('DATE: ' + now);
  }

  confirmDeleteIngredientName(prodIndex: number, ingredIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure you want to delete Ingredient Name ' + (ingredIndex + 1) + '?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteIngredientName(prodIndex, ingredIndex);
      }
    });
  }

  deleteIngredientName(prodIndex: number, ingredIndex: number) {
 //   this.ingredientNameSubstanceUuid = null;
    // Clear the structure
 //   this.ingredientNameUpdated(this.selectedSubstance, ingredIndex);
 //   this.substanceSelectorComp.clearSelectedSubstance();
    this.ingredientNameMessage = 'Click Validate and Submit button to delete ' + this.ingredientName;
    this.ingredientNameSubstanceUuid = null;
    this.ingredientName = null;
    this.ingredient.bdnum = null;
  }

  confirmDeleteBasisOfStrength(prodIndex: number, ingredIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure you want to delete Basis of Strength ' + (ingredIndex + 1) + '?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteBasisOfStrength(prodIndex, ingredIndex);
      }
    });
  }

  deleteBasisOfStrength(prodIndex: number, ingredIndex: number) {
    this.basisOfStrengthMessage = 'Click Validate and Submit button to delete ' + this.basisOfStrengthName;
    this.basisofStrengthSubstanceUuid = null;
    this.basisOfStrengthName = null;
    this.ingredient.basisOfStrengthBdnum = null;
 }

  getBdnum(substanceId: string, type: string) {
    this.applicationService.getSubstanceDetailsBySubstanceId(substanceId).subscribe(response => {
      if (response) {
        if (response.bdnum) {

          if (type === 'ingredientname') {
            this.ingredientNameMessage = '';
            this.ingredient.bdnum = response.bdnum;
            this.ingredientName = response.name;
            this.ingredientNameSubstanceUuid = response.substanceId;
         //   this.substanceSelectorComp.editSelectedSubstance();

            // If Basis of Strenght is empty/null, copy the Ingredient Name to Basis of Strength
            if (this.ingredient.basisOfStrengthBdnum == null) {
              this.basisOfStrengthMessage = '';
              this.ingredient.basisOfStrengthBdnum = response.bdnum;
              this.basisOfStrengthName = response.name;
              this.basisofStrengthSubstanceUuid = response.substanceId;
            }
            // Basis is strength
          } else {
            this.basisOfStrengthMessage = '';
            this.ingredient.basisOfStrengthBdnum = response.bdnum;
            this.basisOfStrengthName = response.name;
            this.basisofStrengthSubstanceUuid = response.substanceId;
          }

        }
      }
    });
  }

  getSubstanceId(bdnum: string, type: string) {
    if (bdnum != null) {
      this.applicationService.getSubstanceDetailsByBdnum(bdnum).subscribe(response => {
        if (response) {
          if (response.substanceId) {

            if (type === 'ingredientname') {
              this.ingredientNameMessage = '';
              this.ingredient.bdnum = response.bdnum;
              this.ingredientName = response.name;
              this.ingredientNameSubstanceUuid = response.substanceId;
              // Basis is strength
            } else {
              this.basisOfStrengthMessage = '';
              this.ingredient.basisOfStrengthBdnum = response.bdnum;
              this.basisOfStrengthName = response.name;
              this.basisofStrengthSubstanceUuid = response.substanceId;
            }
          } else {
            this.basisOfStrengthMessage = '';
            this.basisOfStrengthMessage = 'No Ingredient Name found for this bdnum';
          }
        }
      });
    }
  }

  ingredientNameUpdated(substance: SubstanceSummary, ingredIndex: number): void {
    const relatedSubstance: SubstanceRelated = {
      refPname: substance._name,
      name: substance._name,
      refuuid: substance.uuid,
      substanceClass: 'reference',
      approvalID: substance.approvalID
    };

    if (relatedSubstance != null) {
      if (relatedSubstance.refuuid != null) {
        this.getBdnum(relatedSubstance.refuuid, 'ingredientname');
      }
    } else {
      this.ingredientNameSubstanceUuid = null;
    }
  }

  basisOfStrengthUpdated(substance: SubstanceSummary): void {
    const relatedSubstance: SubstanceRelated = {
      refPname: substance._name,
      name: substance._name,
      refuuid: substance.uuid,
      substanceClass: 'reference',
      approvalID: substance.approvalID
    };

    if (relatedSubstance != null) {
      if (relatedSubstance.refuuid != null) {
        this.getBdnum(relatedSubstance.refuuid, 'basisofstrength');
      }
    }
  }

}
