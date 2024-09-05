import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { ImpuritiesService } from '../../service/impurities.service';
import { Impurities, ImpuritiesDetails, IdentityCriteria, SubRelationship } from '../../model/impurities.model';

@Component({
  selector: 'app-impurities-details-form',
  templateUrl: './impurities-details-form.component.html',
  styleUrls: ['./impurities-details-form.component.scss']
})
export class ImpuritiesDetailsFormComponent implements OnInit {

  public ELUTION_TYPE_ISOCRATIC = 'ISOCRATIC';

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
      this.impuritiesDetails.relatedSubstanceUnii = substance.approvalID;
    }
  }

  addNewImpurities() {
    const newImpuritiesDetails: ImpuritiesDetails = { identityCriteriaList: [] };
    this.impuritiesService.addNewImpuritiesDetails(this.impuritiesSubstanceIndex, this.impuritiesTestIndex, newImpuritiesDetails);
  }

  addNewIdentityCriteria() {
    const identityCriteria: IdentityCriteria = {};
    this.impuritiesDetails.identityCriteriaList.push(identityCriteria);
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
    this.impuritiesService.deleteIdentityCriteria(this.impuritiesSubstanceIndex,
      this.impuritiesTestIndex, this.impuritiesDetailsIndex, identityCriteriaIndex);
  }

}
