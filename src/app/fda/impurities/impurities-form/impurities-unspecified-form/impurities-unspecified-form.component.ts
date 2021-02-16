import { Component, OnInit, Input } from '@angular/core';
import { Impurities, ImpuritiesDetails, IdentityCriteria, ImpuritiesUnspecified, SubRelationship, ValidationMessage } from '../../model/impurities.model';
import { ImpuritiesService } from '../../service/impurities.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-impurities-unspecified-form',
  templateUrl: './impurities-unspecified-form.component.html',
  styleUrls: ['./impurities-unspecified-form.component.scss']
})
export class ImpuritiesUnspecifiedFormComponent implements OnInit {

  @Input() impuritiesUnspecified: ImpuritiesUnspecified;
  @Input() impuritiesUnspecifiedIndex: number;
  @Input() impuritiesTestIndex: number;
  @Input() impuritiesSubstanceIndex: number;

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

  confirmDeleteImpuritiesUnspecified() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Unspecified Impurities ' + (this.impuritiesUnspecifiedIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteImpuritiesUnspecified();
      }
    });
  }

  deleteImpuritiesUnspecified() {
    this.impuritiesService.deleteImpuritiesUnspecified(this.impuritiesSubstanceIndex, 
      this.impuritiesTestIndex, this.impuritiesUnspecifiedIndex);
  }

  addNewIdentityCriteria() {
    this.impuritiesService.addNewIdentityCriteriaUnspecified(this.impuritiesSubstanceIndex, this.impuritiesTestIndex, this.impuritiesUnspecifiedIndex);
  }

  confirmDeleteIdentityCriteria(impuritiesUnspecifiedIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Identity Critieria ' + (impuritiesUnspecifiedIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteIdentityCriteria(impuritiesUnspecifiedIndex);
      }
    });
  }

  deleteIdentityCriteria(identityCriteriaUnspecIndex: number) {
    this.impuritiesService.deleteIdentityCriteriaUnspecified(this.impuritiesSubstanceIndex, 
      this.impuritiesTestIndex, this.impuritiesUnspecifiedIndex, identityCriteriaUnspecIndex);
  }


}
