import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Product, ApplicationIngredient } from '../../model/application.model';
import { ControlledVocabularyService } from '../../../../core/controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../../../core/controlled-vocabulary/vocabulary.model';
import { ApplicationService } from '../../service/application.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { SubstanceRelated, SubstanceSummary } from '@gsrs-core/substance';
import { SubstanceSearchSelectorComponent } from '../../../substance-search-select/substance-search-selector.component';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ConfigService } from '@gsrs-core/config/config.service';
import { GsrsModule } from '@gsrs-core/gsrs.module';

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
  username = null;
  substanceConfig: any;

  constructor(
    private applicationService: ApplicationService,
    public cvService: ControlledVocabularyService,
    private authService: AuthService,
    private configService: ConfigService,
    private dialog: MatDialog) { }

  ngOnInit() {
    setTimeout(() => {
      this.username = this.authService.getUser();

      // Get Substance Linking Key Details from Config file
      this.substanceConfig = this.configService.configData.substance;
      this.ingredient.substanceKeyType = this.substanceConfig.linking.keyType.default;

      this.ingredientNameBdnumOld = this.ingredient.bdnum;
      this.basisofStrengthBdnumOld = this.ingredient.basisOfStrengthBdnum;
    //  this.getSubstanceId(this.ingredient.bdnum, 'ingredientname');
   //   this.getSubstanceId(this.ingredient.basisOfStrengthBdnum, 'basisofstrength');
    }, 600);
  }

  addNewIngredient(prodIndex: number) {
    this.applicationService.addNewIngredient(prodIndex);
  }

  confirmDeleteIngredient(prodIndex: number, ingredIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {message: 'Are you sure you want to delete Ingredient Details ' + (ingredIndex + 1) + '?'}
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

  confirmReviewIngredient() {
    if (this.ingredient.reviewDate) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {message: 'Are you sure you want to overwrite Reviewed By and Review Date?'}
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result === true) {
          this.reviewIngredient();
        }
      });
    } else {
      this.reviewIngredient();
    }
  }

  reviewIngredient() {
    this.applicationService.getCurrentDate().subscribe(response => {
      if (response) {
        this.ingredient.reviewDate = response.date;
        this.ingredient.reviewedBy = this.username;
      }
    });
  }

  confirmDeleteIngredientName(ingredIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {message: 'Are you sure you want to delete Ingredient Name ' + (ingredIndex + 1) + '?'}
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

  confirmDeleteBasisOfStrength(ingredIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {message: 'Are you sure you want to delete Basis of Strength ' + (ingredIndex + 1) + '?'}
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

  getSubstanceCode(substanceId: string, type: string) {
    alert( this.ingredient._name);
    this.applicationService.getSubstanceCodesBySubstanceUuid(substanceId).subscribe(response => {
      if (response) {
        const substanceCodes = response;
          for (let index = 0; index < substanceCodes.length; index++) {
          if (substanceCodes[index].codeSystem) {

            if ((substanceCodes[index].codeSystem === this.ingredient.substanceKeyType) &&
            (substanceCodes[index].type === 'PRIMARY')) {
              this.ingredient.substanceKey = substanceCodes[index].code;
           //   this.ingredient.substanceKeyType = this.applicationService.getSubstanceCodeIdTypeConfig();
              break;
            }
          }
        }

        /*
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

        } */
      } else {
        if (type === 'ingredientname') {
          this.ingredientNameMessage = 'There is no Ingredient Name found for this Substance Code';
        } else {
          this.basisOfStrengthMessage = 'There is no Basis of Strength found for this Substance Code';
        }
      }
    });
  }

  /*
  getSubstanceId(bdnum: string, type: string) {
    alert("SUBBBBBBBBB");
    if (bdnum != null) {
      this.applicationService.getSubstanceDetailsByBdnum(bdnum).subscribe(response => {
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
  */

  getActiveMoiety(substanceId: string, type: string) {
    if (substanceId != null) {
      // Get Active Moiety - Relationship
      this.applicationService.getSubstanceRelationship(substanceId).subscribe(responseRel => {
        if ((type != null) && (type === 'ingredientname')) {
          this.ingredientNameActiveMoiety = responseRel;
        } else {
          this.basisOfStrengthActiveMoiety = responseRel;
        }
      });
    }
  }

  ingredientNameUpdated(substance: SubstanceSummary): void {
    alert('GGGGG ' + substance.uuid);

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
          this.ingredientNameMessage = '';
          this.ingredient._name =   relatedSubstance.name;
          this.ingredient._substanceUuid = relatedSubstance.refuuid;

          this.getSubstanceCode(relatedSubstance.refuuid, 'ingredientname');
        }

      }
    } else {
      this.ingredient._substanceUuid = null;
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
          this.getSubstanceCode(relatedSubstance.refuuid, 'basisofstrength');
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

}
