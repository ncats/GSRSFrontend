import { Component, OnInit, Input } from '@angular/core';
import { ProductSrs } from '../../model/application.model';
import { ControlledVocabularyService } from '../../../../core/controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../../../core/controlled-vocabulary/vocabulary.model';
import { ApplicationService } from '../../service/application.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-ingredient-form',
  templateUrl: './ingredient-form.component.html',
  styleUrls: ['./ingredient-form.component.scss']
})
export class IngredientFormComponent implements OnInit {

  @Input() product: ProductSrs;
  @Input() prodIndex: number;
  ingredientTypeList: Array<VocabularyTerm> = [];
  unitList: Array<VocabularyTerm> = [];
  gradeList: Array<VocabularyTerm> = [];
  reviewIngredientMessage: Array<any> = [];
  ingredientMessage = '';

  constructor(
    private applicationService: ApplicationService,
    public cvService: ControlledVocabularyService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.getVocabularies();
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

  confirmDeleteIngredient(prodIndex: number , ingredIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure you want to delete Ingredient Details ' + (ingredIndex + 1) + ' data?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        console.log(result);
          this.deleteIngredient(prodIndex, ingredIndex)
      }
    });
  }

  deleteIngredient(prodIndex: number , ingredIndex: number) {
    this.applicationService.deleteIngredient(prodIndex, ingredIndex);
  }

  copyIngredient(ingredient: any, prodIndex) {
    this.applicationService.copyIngredient(ingredient, prodIndex);
  }

  reviewIngredient(ingredient: any, prodIndex , ingredIndex: number) {
    this.reviewIngredientMessage[prodIndex] = new Date();
    this.applicationService.reviewIngredient(prodIndex, ingredIndex);
   // const dateFormat = require('dateformat');
  //  const now = new Date();
  //  dateFormat(now, 'dddd, mmmm dS, yyyy, h:MM:ss TT');
  //  console.log('DATE: ' + now);
  }
}
