import { Component, OnInit, Input } from '@angular/core';
import { Impurities, ImpuritiesDetails, ImpuritiesResidualSolvents, ImpuritiesInorganic, IdentityCriteria, SubRelationship } from '../../model/impurities.model';
import { ImpuritiesService } from '../../service/impurities.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-impurities-inorganic-form',
  templateUrl: './impurities-inorganic-form.component.html',
  styleUrls: ['./impurities-inorganic-form.component.scss']
})
export class ImpuritiesInorganicFormComponent implements OnInit {

  @Input() impuritiesInorganic: ImpuritiesInorganic;
  @Input() impuritiesInorganicIndex: number;
  @Input() impuritiesSubstanceIndex: number;
  @Input() inorganicTestIndex: number;

  constructor(
    private impuritiesService: ImpuritiesService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  relatedSubstanceUpdated(substance: any): void {
    if (substance != null) {
      this.impuritiesInorganic.relatedSubstanceUuid = substance.uuid;
      this.impuritiesInorganic.relatedSubstanceUnii = substance.approvalID;
    }
  }

  confirmDeleteImpuritiesInorganic() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Inorganic Impurities ' + (this.impuritiesInorganicIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteImpuritiesInorganic();
      }
    });
  }

  deleteImpuritiesInorganic() {
    this.impuritiesService.deleteImpuritiesInorganic(this.impuritiesSubstanceIndex, this.inorganicTestIndex, this.impuritiesInorganicIndex);
  }

}
