import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Impurities, ImpuritiesTesting, ImpuritiesDetails, IdentityCriteria, SubRelationship, ImpuritiesSubstance } from '../../model/impurities.model';
import { ImpuritiesService } from '../../service/impurities.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { GeneralService } from '../../../service/general.service';

@Component({
  selector: 'app-impurities-test-form',
  templateUrl: './impurities-test-form.component.html',
  styleUrls: ['./impurities-test-form.component.scss']
})
export class ImpuritiesTestFormComponent implements OnInit, OnDestroy {

  @Input() impuritiesTest: ImpuritiesTesting;
  @Input() impuritiesTestIndex: number;
  @Input() impuritiesSubstanceIndex: number;

  private subscriptions: Array<Subscription> = [];
  searchValue: string;
  elutionType = 'Isocratic';

  letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K'];

  constructor(
    private impuritiesService: ImpuritiesService,
    private generalService: GeneralService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  addNewElutionSolvent($event) {
    this.impuritiesService.addNewImpuritiesElutionSolvent(this.impuritiesSubstanceIndex, this.impuritiesTestIndex);
  }

  addNewSolution() {
     // Only allowed to add up to 10 Solutiions. Up to Solution K
    if (this.impuritiesTest.impuritiesSolutionList.length < 10) {
      this.impuritiesService.addNewSolution(this.impuritiesSubstanceIndex, this.impuritiesTestIndex);

      let lastSolutionIndex = this.impuritiesService.impurities.impuritiesSubstanceList[this.impuritiesSubstanceIndex].impuritiesTestList[this.impuritiesTestIndex].impuritiesSolutionList.length - 1;

      // Assign letter A, B,.. in the field based on the solution index
      this.impuritiesService.impurities.impuritiesSubstanceList[this.impuritiesSubstanceIndex].impuritiesTestList[this.impuritiesTestIndex]
        .impuritiesSolutionList[lastSolutionIndex].solutionLetter = this.getLetter(lastSolutionIndex);

    } else {
      // Only allowed to add up to 10 Solutiions, otherwise display message
      alert("Only allowed to add up to Solution K");
    }
  }

  confirmDeleteImpuritiesSolution(solutionIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Solution ' + this.getLetter(solutionIndex) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteImpuritiesSolution(solutionIndex);
      }
    });
  }

  deleteImpuritiesSolution(solutionIndex: number) {
    this.impuritiesService.deleteImpuritiesSolution(this.impuritiesSubstanceIndex, this.impuritiesTestIndex, solutionIndex);

    // After Solution is deleted, reassign the solutionletter to A, B, ect by Solution index
    this.impuritiesTest.impuritiesSolutionList.forEach((solution, index) => {
      if (solution) {
        solution.solutionLetter = this.getLetter(index);
      }
    });
  }

  addNewSolutionTableDetails() {
    this.impuritiesService.addNewSolutionTableDetails(this.impuritiesSubstanceIndex, this.impuritiesTestIndex);
  }

  confirmDeleteImpuritiesSolutionTable(solutionTableIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Solution Table row ' + (solutionTableIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteImpuritiesSolutionTable(solutionTableIndex);
      }
    });
  }

  deleteImpuritiesSolutionTable(solutionTableIndex: number) {
    this.impuritiesService.deleteImpuritiesSolutionTable(this.impuritiesSubstanceIndex, this.impuritiesTestIndex, solutionTableIndex);
  }

  addNewImpuritiesDetails() {
    this.createNewImpurities(null);
  }

  createNewImpurities(relationshipUuid: string) {
    const newImpuritiesDetails: ImpuritiesDetails = { identityCriteriaList: [] };
    newImpuritiesDetails.relatedSubstanceUuid = relationshipUuid;
    this.impuritiesTest.impuritiesDetailsList.unshift(newImpuritiesDetails);
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

  confirmDeleteImpuritiesElutionSolvent(elutionIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Elution Solvent ' + (elutionIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteImpuritiesElutionSolvent(elutionIndex);
      }
    });
  }

  deleteImpuritiesElutionSolvent(elutionIndex: number) {
    this.impuritiesService.deleteImpuritiesElutionSolvent(this.impuritiesSubstanceIndex, this.impuritiesTestIndex, elutionIndex);
  }

  nameSearch(event: any, impuritiesTestIndex: number, impuritiesElutionIndex: number): void {
    this.impuritiesTest.impuritiesElutionSolventList[impuritiesElutionIndex].elutionSolvent = event;

    const substanceSubscribe = this.generalService.getSubstanceByName(event).subscribe(response => {
      if (response) {
        if (response.content && response.content.length > 0) {
          const substance = response.content[0];
          if (substance) {
            if (substance.approvalID) {
              this.impuritiesTest.impuritiesElutionSolventList[impuritiesElutionIndex].elutionSolventCode = substance.approvalID;
            } else {
              this.impuritiesTest.impuritiesElutionSolventList[impuritiesElutionIndex].elutionSolventCode = substance.uuid;
            }
          }
        }
      }
    });
    this.subscriptions.push(substanceSubscribe);
  }

  getLetter(index: number): string {
    return this.letters[index];
  }
}