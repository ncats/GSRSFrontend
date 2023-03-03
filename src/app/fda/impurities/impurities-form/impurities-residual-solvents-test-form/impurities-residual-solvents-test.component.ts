import { Component, OnInit, Input } from '@angular/core';
import { Impurities, ImpuritiesResidualSolventsTest, ImpuritiesTesting, ImpuritiesDetails, IdentityCriteria, SubRelationship, ImpuritiesSubstance } from '../../model/impurities.model';
import { ImpuritiesService } from '../../service/impurities.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-impurities-residual-solvents-test',
  templateUrl: './impurities-residual-solvents-test.component.html',
  styleUrls: ['./impurities-residual-solvents-test.component.scss']
})
export class ImpuritiesResidualSolventsTestComponent implements OnInit {

  @Input() impuritiesResidualSolventsTest: ImpuritiesResidualSolventsTest;
  @Input() residualSolventsTestIndex: number;
  @Input() impuritiesSubstanceIndex: number;

  constructor( private impuritiesService: ImpuritiesService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  addNewImpuritiesResidualSolvents(event: Event) {
    event.stopPropagation();

    this.impuritiesService.addNewImpuritiesResidualSolvents(this.impuritiesSubstanceIndex, this.residualSolventsTestIndex);
  }

  confirmDeleteImpuritiesResdiualSolventTest() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Residual Solvent Test ' + (this.residualSolventsTestIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteImpuritiesResdiualSolventTest();
      }
    });
  }

  deleteImpuritiesResdiualSolventTest() {
    this.impuritiesService.deleteImpuritiesResdiualSolventTest(this.impuritiesSubstanceIndex, this.residualSolventsTestIndex);
  }

  confirmDeleteImpuritiesTest() {
    /*
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Test ' + (this.impuritiesTestIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteImpuritiesTest();
      }
    }); */
  }


  /*
  addNewImpuritiesDetails() {
    this.createNewImpurities(null);
  }

  createNewImpurities(relationshipUuid: string) {
    const newImpuritiesDetails: ImpuritiesDetails = { identityCriteriaList: [] };
    newImpuritiesDetails.relatedSubstanceUuid = relationshipUuid;
  //  this.impuritiesTest.impuritiesDetailsList.unshift(newImpuritiesDetails);
  }

  addNewImpuritiesUnspecified() {
    this.impuritiesService.addNewImpuritiesUnspecified(this.impuritiesSubstanceIndex, this.impuritiesTestIndex);
  }

  confirmDeleteImpuritiesTest() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Test ' + (this.impuritiesTestIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteImpuritiesTest();
      }
    });
  }

  deleteImpuritiesTest() {
    this.impuritiesService.deleteImpuritiesTest(this.impuritiesSubstanceIndex, this.impuritiesTestIndex);
  }
*/
}
