import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { ViewEncapsulation, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
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
import { ProductIngredient, ValidationMessage } from '../../model/product.model';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { JsonDialogFdaComponent } from '../../../json-dialog-fda/json-dialog-fda.component';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { SubstanceSearchSelectorComponent } from '../../../substance-search-select/substance-search-selector.component';
import { SubstanceRelated, SubstanceSummary } from '@gsrs-core/substance';

@Component({
  selector: 'app-product-ingredient-form',
  templateUrl: './product-ingredient-form.component.html',
  styleUrls: ['./product-ingredient-form.component.scss']
})
export class ProductIngredientFormComponent implements OnInit {

  @ViewChildren ('checkBox') checkBox: QueryList<any>;
  @Input() ingredient: ProductIngredient;
  @Input() totalIngredient: number;
  @Input() prodIngredientIndex: number;
  @Input() prodComponentIndex: number;
  @Input() prodLotIndex: number;

  /*
  ingredientTypeList: Array<VocabularyTerm> = [];
  unitList: Array<VocabularyTerm> = [];
  gradeList: Array<VocabularyTerm> = [];
  releaseCharacteristicList: Array<VocabularyTerm> = [];
  */
  productMessage = '';
  username = null;
  ingredientName: string;
  ingredientNameSubstanceUuid: string;
  ingredientNameBdnumOld: string;
  basisofStrengthBdnumOld: string;
  ingredientNameMessage = '';
  basisOfStrengthName: string;
  basisofStrengthSubstanceUuid: string;
  basisOfStrengthMessage = '';
  relationship: any;
  ingredientNameActiveMoiety: any;
  basisOfStrengthActiveMoiety: any;
  selectedIngredientLocation = new Array<any>();

  locationList: Array<any> = [
    { value: 'Whole', checked: false },
    { value: 'Core', checked: false },
    { value: 'Coating', checked: false },
    { value: 'Other', checked: false }
  ];

  constructor(
    private productService: ProductService,
    public cvService: ControlledVocabularyService,
    private authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit() {
    setTimeout(() => {
      this.loadIngredientLocation();
      this.username = this.authService.getUser();
      this.ingredientNameBdnumOld = this.ingredient.bdnum;
      this.basisofStrengthBdnumOld = this.ingredient.basisOfStrengthBdnum;
      this.getSubstanceId(this.ingredient.bdnum, 'ingredientname');
      this.getSubstanceId(this.ingredient.basisOfStrengthBdnum, 'basisofstrength');
    }, 600);
  }

  loadIngredientLocation() {
    if ((this.ingredient.ingredientLocation !== null) && (this.ingredient.ingredientLocation.length > 0)) {
      const arrLoc = this.ingredient.ingredientLocation.split(',');
      for (let i = 0; i < this.locationList.length; i++) {
        for (let j = 0; j < arrLoc.length; j++) {
          if (this.locationList[i].value === arrLoc[j]) {
            this.locationList[i].checked = true;
          }
        }
      }
    }
  }

  setSelectedIngredientLocation(data: any, checkbox) {
    let selStr = '';
    const selected = [];
    const checked = this.checkBox.filter(checkbox1 => checkbox1.checked);
    checked.forEach(data1 => {
      selected.push(data1.value);
    });
    if (selected.length > 0) {
      selStr = selected.join(',');
      this.ingredient.ingredientLocation = selStr;
    }
  }

  confirmDeleteProductIngredient(prodComponentIndex: number, prodLotIndex: number, prodIngredientIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Product Ingredient Details ' + (prodIngredientIndex + 1) + ' data?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteProductIngredient(prodComponentIndex, prodLotIndex, prodIngredientIndex);
      }
    });
  }

  deleteProductIngredient(prodComponentIndex: number, prodLotIndex: number, prodIngredientIndex: number) {
    this.productService.deleteProductIngredient(prodComponentIndex, prodLotIndex, prodIngredientIndex);
  }

  getBdnum(substanceId: string, type: string) {
    this.productService.getSubstanceDetailsBySubstanceId(substanceId).subscribe(response => {
      if (response) {
        if (response.bdnum) {

          if (type === 'ingredientname') {
            this.ingredientNameMessage = '';
            this.ingredient.bdnum = response.bdnum;
            this.ingredientName = response.name;
            this.ingredientNameSubstanceUuid = response.substanceId;

            // Get Active Moiety
            this.getActiveMoiety(response.substanceId, 'ingredientname');

            // If Basis of Strenght is empty/null, copy the Ingredient Name to Basis of Strength
            if (this.ingredient.basisOfStrengthBdnum == null) {
              this.basisOfStrengthMessage = '';
              this.ingredient.basisOfStrengthBdnum = response.bdnum;
              this.basisOfStrengthName = response.name;
              this.basisofStrengthSubstanceUuid = response.substanceId;

              // Get Active Moiety
              this.getActiveMoiety(response.substanceId, 'basisofstrength');
            }
            // Basis is strength
          } else {
            this.basisOfStrengthMessage = '';
            this.ingredient.basisOfStrengthBdnum = response.bdnum;
            this.basisOfStrengthName = response.name;
            this.basisofStrengthSubstanceUuid = response.substanceId;

            // Get Active Moiety
            this.getActiveMoiety(response.substanceId, 'basisofstrength');
          }

        }
      } else {
        if (type === 'ingredientname') {
          this.ingredientNameMessage = 'There is no Ingredient Name found for this bdnum';
        } else {
          this.basisOfStrengthMessage = 'There is no Basis of Strength found for this bdnum';
        }
      }
    });
  }

  getSubstanceId(bdnum: string, type: string) {
    if (bdnum != null) {
      this.productService.getSubstanceDetailsByBdnum(bdnum).subscribe(response => {
        if (response) {
          if (response.substanceId) {
            if (type === 'ingredientname') {
              this.ingredientNameMessage = '';
              this.ingredient.bdnum = response.bdnum;
              this.ingredientName = response.name;
              this.ingredientNameSubstanceUuid = response.substanceId;

              // Get Active Moiety
              this.getActiveMoiety(response.substanceId, 'ingredientname');

            } else {    // Basis is strength
              this.basisOfStrengthMessage = '';
              this.ingredient.basisOfStrengthBdnum = response.bdnum;
              this.basisOfStrengthName = response.name;
              this.basisofStrengthSubstanceUuid = response.substanceId;

              // Get Active Moiety
              this.getActiveMoiety(response.substanceId, 'basisofstrength');
            }
          } else {
            this.basisOfStrengthMessage = '';
            this.basisOfStrengthMessage = 'No Ingredient Name found for this bdnum';
          }
        } else {
          if (type === 'ingredientname') {
            this.ingredientNameMessage = 'There is no Ingredient Name found for this bdnum';
          } else {
            this.basisOfStrengthMessage = 'There is no Basis of Strength found for this bdnum';
          }
        }
      });
    }
  }

  getActiveMoiety(substanceId: string, type: string) {
    if (substanceId != null) {
      // Get Active Moiety - Relationship
      this.productService.getSubstanceRelationship(substanceId).subscribe(responseRel => {
        if ((type != null) && (type === 'ingredientname')) {
          this.ingredientNameActiveMoiety = responseRel;
        } else {
          this.basisOfStrengthActiveMoiety = responseRel;
        }
      });
    }
  }

  ingredientNameUpdated(substance: SubstanceSummary): void {
    this.ingredientNameMessage = '';
    if (substance != null) {
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
      }
    } else {
      this.ingredientNameSubstanceUuid = null;
    }
  }

  basisOfStrengthUpdated(substance: SubstanceSummary): void {
    if (substance != null) {
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
    } else {
      this.basisofStrengthSubstanceUuid = null;
    }
  }

  showMessageIngredientName(message: string): void {
    this.ingredientNameMessage = message;
  }

  showMessageBasisOfStrength(message: string): void {
    this.basisOfStrengthMessage = message;
  }

  copyProductIngredient() {
    this.productService.copyProductIngredient(this.ingredient, this.prodComponentIndex, this.prodLotIndex);
  }

  confirmDeleteIngredientName() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Ingredient Name ' + (this.prodIngredientIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteIngredientName();
      }
    });
  }

  deleteIngredientName() {
    this.ingredientNameMessage = '';
    if (this.ingredient.id != null) {
      // Display this message if deleting existing Ingredient Name which is in database.
      if (this.ingredientNameBdnumOld != null) {
        this.ingredientNameMessage = 'Click Validate and Submit button to delete ' + this.ingredientName;
      }
    }
    this.ingredientNameSubstanceUuid = null;
    this.ingredientName = null;
    this.ingredient.bdnum = null;
  }

  confirmDeleteBasisOfStrength() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Basis of Strength ' + (this.prodIngredientIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteBasisOfStrength();
      }
    });
  }

  deleteBasisOfStrength() {
    this.basisOfStrengthMessage = '';
    if (this.ingredient.id != null) {
      // Display this message if deleting existing Basis of Strength which is in database.
      if (this.basisofStrengthBdnumOld != null) {
        this.basisOfStrengthMessage = 'Click Validate and Submit button to delete ' + this.basisOfStrengthName;
      }
    }
    this.basisofStrengthSubstanceUuid = null;
    this.basisOfStrengthName = null;
    this.ingredient.basisOfStrengthBdnum = null;
  }

}
