import { Component, OnInit, Input } from '@angular/core';
import { Impurities, ImpuritiesTesting, ImpuritiesDetails,
         IdentityCriteria, SubRelationship, ImpuritiesSubstance, ImpuritiesInorganicTest } from '../../model/impurities.model';
import { ImpuritiesService } from '../../service/impurities.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-impurities-inorganic-form-test',
  templateUrl: './impurities-inorganic-form-test.component.html',
  styleUrls: ['./impurities-inorganic-form-test.component.scss']
})
export class ImpuritiesInorganicFormTestComponent implements OnInit {

  @Input() impuritiesInorganicTest: ImpuritiesInorganicTest;
  @Input() inorganicTestIndex: number;
  @Input() impuritiesSubstanceIndex: number;

  constructor( private impuritiesService: ImpuritiesService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  addNewImpuritiesInorganic(event: Event) {
    event.stopPropagation();

    this.impuritiesService.addNewImpuritiesInorganic(this.impuritiesSubstanceIndex, this.inorganicTestIndex);
  }

  confirmDeleteInorganicTest() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Inorganic Impurities Test ' + (this.inorganicTestIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteInorganicTest();
      }
    });
  }

  deleteInorganicTest() {
    this.impuritiesService.deleteImpuritiesInorganicTest(this.impuritiesSubstanceIndex, this.inorganicTestIndex);
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
