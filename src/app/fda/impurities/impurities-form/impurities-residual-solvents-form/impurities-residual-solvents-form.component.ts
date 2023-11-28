import { Component, OnInit, Input } from '@angular/core';
import { Impurities, ImpuritiesDetails, ImpuritiesResidualSolvents, IdentityCriteria, SubRelationship } from '../../model/impurities.model';
import { ImpuritiesService } from '../../service/impurities.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-impurities-residual-solvents-form',
  templateUrl: './impurities-residual-solvents-form.component.html',
  styleUrls: ['./impurities-residual-solvents-form.component.scss']
})
export class ImpuritiesResidualSolventsFormComponent implements OnInit {

  @Input() impuritiesResidualSolvents: ImpuritiesResidualSolvents;
  @Input() impuritiesResidualIndex: number;
  @Input() impuritiesSubstanceIndex: number;
  @Input() residualSolventsTestIndex:number;

  constructor(
  private impuritiesService: ImpuritiesService,
  private loadingService: LoadingService,
  private authService: AuthService,
  private dialog: MatDialog) {}

  ngOnInit() {
  }

  confirmDeleteImpuritiesResidualSolvents() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Residual Solvents ' + (this.impuritiesResidualIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteImpuritiesResidualSolvents();
      }
    });
  }

  deleteImpuritiesResidualSolvents() {
    this.impuritiesService.deleteImpuritiesResidualSolvents(this.impuritiesSubstanceIndex, this.residualSolventsTestIndex, this.impuritiesResidualIndex);
  }

  relatedSubstanceUpdated(substance: any): void {
    if (substance != null) {
      this.impuritiesResidualSolvents.relatedSubstanceUuid = substance.uuid;
      this.impuritiesResidualSolvents.relatedSubstanceUnii = substance.approvalID;
    }
  }

}
