import { Component, OnInit, Input } from '@angular/core';
import { Impurities, ImpuritiesSubstance, ImpuritiesTesting, ImpuritiesDetails, IdentityCriteria, SubRelationship } from '../../model/impurities.model';
import { ImpuritiesService } from '../../service/impurities.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-impurities-substance-form',
  templateUrl: './impurities-substance-form.component.html',
  styleUrls: ['./impurities-substance-form.component.scss']
})
export class ImpuritiesSubstanceFormComponent implements OnInit {

  @Input() impuritiesSubstance: ImpuritiesSubstance;
  @Input() impuritiesSubstanceIndex: number;

  isLoading = true;
  errorMessage: string;
  searchValue: string;
  subscriptions: Array<Subscription> = [];
  existingImpurities: Array<SubRelationship> = [];

  //  subRelationship: Array<SubRelationship> = [];
  substanceName: string;
  substanceNameHintMessage = '';

  constructor(
    private impuritiesService: ImpuritiesService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  relatedSubstanceUpdated(substance: any): void {
    if (substance != null) {
      this.impuritiesSubstance.substanceUuid = substance.uuid;
      this.impuritiesSubstance.relatedSubstanceUnii = substance.approvalID;
    }
  }

  getExistingImpuritiesFromSubstance() {
    this.isLoading = true;
    this.loadingService.setLoading(true);
    this.errorMessage = 'Getting Existing Impurities...';

    const substanceUuid = this.impuritiesSubstance.substanceUuid;
    if (substanceUuid) {
      const getRelImpuritySubscribe = this.impuritiesService.getRelationshipImpurity(substanceUuid).subscribe(response => {
        if (response) {
          let relImpurities = response.data;

          if (Object.keys(relImpurities).length > 0) {
            // Remove Duplicate Impurites Substance UUID
            this.existingImpurities = relImpurities.filter((v, i) => relImpurities.findIndex
            (item => item.relationshipUuid === v.relationshipUuid) === i);
            this.loadExistingImpurities();
          } else {
            this.errorMessage = 'No Impurities found';
          }
        }
      });
      this.subscriptions.push(getRelImpuritySubscribe);
    } else {
      this.errorMessage = 'Please select a Substance Name';
    }

    this.loadingService.setLoading(false);
    this.isLoading = false;
  }

  loadExistingImpurities() {
    this.errorMessage = 'Found ' + this.existingImpurities.length + ' Existing Impurities';
    // Add New Test
    this.addNewTest();
    this.existingImpurities.forEach((elementRel) => {

      const newImpuritiesDetails: ImpuritiesDetails = { identityCriteriaList: [] };
      newImpuritiesDetails.relatedSubstanceUuid = elementRel.relationshipUuid;
      newImpuritiesDetails.relatedSubstanceUnii = elementRel.relationshipUnii;
      // Creating a New Impurities Detail for Test 0
      this.impuritiesService.addNewImpuritiesDetails(this.impuritiesSubstanceIndex, 0, newImpuritiesDetails);
    });
  }

  createNewImpurities(relationshipUuid: string) {
    const newImpuritiesDetails: ImpuritiesDetails = { identityCriteriaList: [] };
    newImpuritiesDetails.relatedSubstanceUuid = relationshipUuid;
  }

  addNewImpuritiesSubstance() {
    this.impuritiesService.addNewImpuritiesSubstance();
  }

  getSubstancePreferredName(substanceUuid: string): void {
    const getSubDetailsSubscribe = this.impuritiesService.getSubstanceDetailsBySubstanceId(substanceUuid).subscribe(substanceNames => {
      this.searchValue = substanceNames.name;
    });
    this.subscriptions.push(getSubDetailsSubscribe);
  }

  addNewTest() {
    this.impuritiesService.addNewTest(this.impuritiesSubstanceIndex);
  }

  addNewImpuritiesResidualSolvents() {
    this.impuritiesService.addNewImpuritiesResidualSolvents(this.impuritiesSubstanceIndex);
  }

  addNewImpuritiesInorganic() {
    this.impuritiesService.addNewImpuritiesInorganic(this.impuritiesSubstanceIndex);
  }

  confirmDeleteImpuritiesSubstance() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Substance Name ' + (this.impuritiesSubstanceIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteImpuritiesSubstance();
      }
    });
  }

  deleteImpuritiesSubstance() {
    this.impuritiesService.deleteImpuritiesSubstance(this.impuritiesSubstanceIndex);
  }

}
