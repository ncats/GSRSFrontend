import { Component, OnInit, Input } from '@angular/core';
import { Impurities, ImpuritiesDetails, IdentityCriteria, SubRelationship } from '../../model/impurities.model';
import { ImpuritiesService } from '../../service/impurities.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-impurities-details-form',
  templateUrl: './impurities-details-form.component.html',
  styleUrls: ['./impurities-details-form.component.scss']
})
export class ImpuritiesDetailsFormComponent implements OnInit {

  @Input() impuritiesDetails: ImpuritiesDetails;
  @Input() impuritiesDetailsIndex: number;
  @Input() impuritiesTestIndex: number;
  @Input() impuritiesSubstanceIndex: number;
  @Input() relatedSubstanceUuid: string;

  impurity: any;
  public subRelationship: Array<SubRelationship> = [];
  substanceName: string;
  isDisableData: false;
  isLoading = false;

  constructor(
    private impuritiesService: ImpuritiesService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  relatedSubstanceUpdated(substance: any): void {
    if (substance != null) {
      this.impuritiesDetails.relatedSubstanceUuid = substance.uuid;
    }
  }

  addNewImpurities() {
    const newImpuritiesDetails: ImpuritiesDetails = { identityCriteriaList: [] };
    this.impuritiesService.addNewImpuritiesDetails(this.impuritiesSubstanceIndex, 
      this.impuritiesTestIndex, newImpuritiesDetails);  
  }

  /*
getImpurities() {
  this.isLoading = true;
  this.loadingService.setLoading(true);
  this.impuritiesService.getRelationshipImpurity(this.impurity.parentSubstanceId).subscribe(response => {
    if (response) {
      this.subRelationship = response.data;

      //  this.impurity.impuritiesList[0].relationshipList = response[0];
      console.log(JSON.stringify(this.subRelationship));
      //  alert(this.subRelationship.length);
    }
  });

  // alert(this.subRelationship.length);
  if (this.subRelationship.length > 0) {
    this.getRelationship();
  }

  this.loadingService.setLoading(false);
  this.isLoading = false;
}


getRelationship() {
  // alert(this.subRelationship.length);
  this.subRelationship.forEach((elementRel, indexRel) => {
    this.createNewImpurities(elementRel.relationshipUuid);
    //  this.addNewImpurities();
    //  alert(indexRel);
    //     this.impurity.impuritiesList[indexRel].testType = 'Type' + indexRel;

    // this.impurity.impuritiesList[indexRel].subRelationship = elementRel;
    // this.impurity.impuritiesList[indexRel].maturityType = 'Type' + indexRel;
    //   console.log('GG' + JSON.stringify(this.impurity.impuritiesList[indexRel].subRelationship));
    // alert(this.impurity.impuritiesList.length);
  });

  //  this.impurity.impuritiesList[0].maturityType = 'Test';
}
*/

  /*
  createNewImpurities(relationshipUuid: string) {
    const newImpurities: Impurities = {};
    //  newImpurities.testType = 'Test';
    //  newImpurities.highLimit = 0;
    //   newImpurities.relatedSubstanceUuid = relationshipUuid;
    this.impurity.impuritiesList.unshift(newImpurities);
  }
  */

 // getRelationshipImpurity(substanceId: string) {
 //   this.impuritiesService.getRelationshipImpurity(substanceId);
 // }

  addNewIdentityCriteria() {
    const identityCriteria: IdentityCriteria = {};
    this.impuritiesDetails.identityCriteriaList.unshift(identityCriteria);
  }

  confirmDeleteImpuritiesDetails() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Impurities ' + (this.impuritiesDetailsIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteImpuritiesDetails();
      }
    });
  }

  deleteImpuritiesDetails() {
    this.impuritiesService.deleteImpuritiesDetails(this.impuritiesSubstanceIndex, this.impuritiesTestIndex, this.impuritiesDetailsIndex);
  }

  confirmDeleteIdentityCriteria(impuritiesDetailsIndex: number, identityCriteriaIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Identity Criteria ' + (identityCriteriaIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteIdentityCriteria(identityCriteriaIndex);
      }
    });
  }

  deleteIdentityCriteria(identityCriteriaIndex: number) {
    this.impuritiesService.deleteIdentityCriteria(this.impuritiesSubstanceIndex, this.impuritiesTestIndex, 
      this.impuritiesDetailsIndex, identityCriteriaIndex);
  }

}
