import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { GeneralService } from '../../../service/general.service';
import { ImpuritiesService } from '../../service/impurities.service';
import { ImpuritiesTesting, ImpuritiesDetails, ImpuritiesSolutionTable } from '../../model/impurities.model';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-impurities-test-form',
  templateUrl: './impurities-test-form.component.html',
  styleUrls: ['./impurities-test-form.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImpuritiesTestFormComponent implements OnInit, OnDestroy {

  public ELUTION_TYPE_ISOCRATIC = 'ISOCRATIC';
  public ELUTION_TYPE_GRADIENT = 'GRADIENT';

  @Input() impuritiesTest: ImpuritiesTesting;
  @Input() impuritiesTestIndex: number;
  @Input() impuritiesSubstanceIndex: number;

  dataSource: MatTableDataSource<ImpuritiesSolutionTable>;

  private subscriptions: Array<Subscription> = [];
  searchValue: string;
  elutionType = 'Isocratic';

  displayedColumns = [
    'Time (min)'
  ]

  letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  private privateShowAdvancedSettings = false;
  configSettingsDisplay = {};

  constructor(
    private impuritiesService: ImpuritiesService,
    private configService: ConfigService,
    private generalService: GeneralService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // Load item in displayColumns based on Solution Letter
    this.addfieldsInDisplayColumns();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  @Input()
  set showAdvancedSettings(showAdvancedSettings: boolean) {
    this.privateShowAdvancedSettings = showAdvancedSettings;

    // Get Config Settins from config file
    this.getConfigSettings();
  }

  get showAdvancedSettings(): boolean {
    return this.privateShowAdvancedSettings;
  }

  getConfigSettings(): void {
    // Get Impurities Config Settings from config.json file to show and hide fields in the form
    let configImpuritiesForm: any;
    configImpuritiesForm = this.configService.configData && this.configService.configData.impuritiesForm || null;

    // Get 'test' json values from config
    const confSettings = configImpuritiesForm.settingsDisplay.test

    Object.keys(confSettings).forEach(key => {
      if (confSettings[key] != null) {
        if (confSettings[key] === 'simple') {
          this.configSettingsDisplay[key] = true;
        } else if (confSettings[key] === 'advanced') {
          if (this.privateShowAdvancedSettings === true) {
            this.configSettingsDisplay[key] = true;
          } else {
            this.configSettingsDisplay[key] = false;
          }
        } else if (confSettings[key] === 'removed') {
          this.configSettingsDisplay[key] = false;
        }
      } else {
        // if either value (simple,advanced,removed) missing in config, show field on the form
        this.configSettingsDisplay[key] = true;
      }
    });
  }

  addNewElutionSolvent($event) {
    this.impuritiesService.addNewImpuritiesElutionSolvent(this.impuritiesSubstanceIndex, this.impuritiesTestIndex);
  }

  addNewSolution() {
    if (this.impuritiesTest.impuritiesSolutionList) {
      // Only allowed to add up to 10 Solutiions. Up to Solution K
      if (this.impuritiesTest.impuritiesSolutionList.length < 10) {
        this.impuritiesService.addNewSolution(this.impuritiesSubstanceIndex, this.impuritiesTestIndex);

        let lastSolutionIndex = this.impuritiesService.impurities.impuritiesSubstanceList[this.impuritiesSubstanceIndex].impuritiesTestList[this.impuritiesTestIndex].impuritiesSolutionList.length - 1;

        // Assign letter A, B,.. in the field based on the solution index
        this.impuritiesService.impurities.impuritiesSubstanceList[this.impuritiesSubstanceIndex].impuritiesTestList[this.impuritiesTestIndex]
          .impuritiesSolutionList[lastSolutionIndex].solutionLetter = this.getLetter(lastSolutionIndex);


        // add letter in the Mobile Phase column
        this.displayedColumns.push('Solution ' + this.getLetter(lastSolutionIndex) + ' (%)')

      } else {
        // Only allowed to add up to 10 Solutiions, otherwise display message
        alert("Only allowed to add up to Solution J");
      }
    }
  }

  addfieldsInDisplayColumns() {
    if (this.impuritiesTest.impuritiesSolutionList) {
      if (this.impuritiesTest.impuritiesSolutionList.length > 0) {
        this.impuritiesTest.impuritiesSolutionList.forEach((solution, indexSolution) => {
          if (solution.solutionLetter) {

            if ((this.impuritiesTest.impuritiesSolutionList.length + 2) != this.displayedColumns.length) {
              // add letter in the Mobile Phase column
              this.displayedColumns.push('Solution ' + solution.solutionLetter + ' (%)')
            }

            // IMPORTANT: Need this for Change Detection after assigning new data to dataSource
            this.dataSource = new MatTableDataSource(this.impuritiesTest.impuritiesSolutionTableList);
          }
        });
      }
    }
  }

  confirmDeleteImpuritiesSolution(solutionIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Solution ' + this.getLetter(solutionIndex) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteImpuritiesSolution(solutionIndex);
        this.cdr.markForCheck();
      }
    });
  }

  deleteImpuritiesSolution(solutionIndex: number) {

    let solutionLetterBeforeDelete = this.impuritiesTest.impuritiesSolutionList[solutionIndex].solutionLetter;

    this.impuritiesService.deleteImpuritiesSolution(this.impuritiesSubstanceIndex, this.impuritiesTestIndex, solutionIndex);

    // Remove the same Letter/column in the Mobile Phase table.
    // solutionIndex + 1, means do not count 'Time (min)' in the displayedColumns
    this.displayedColumns.splice(solutionIndex + 1, 1);

    // Set fields to empty string
    this.impuritiesTest.impuritiesSolutionTableList.forEach(solTable => {
      if (solTable) {
        let fieldName = 'solution' + solutionLetterBeforeDelete + 'Percent';
        solTable[fieldName] = 0;
      }
    });

    // After Solution is deleted, reassign the solutionletter to A, B, ect by Solution index
    this.impuritiesTest.impuritiesSolutionList.forEach((solution, indexSol) => {
      if (solution) {
        solution.solutionLetter = this.getLetter(indexSol);

        let columnName = 'Solution ' + solution.solutionLetter + ' (%)';

        this.displayedColumns[indexSol + 1] = columnName;
      }
    });

    // If no Solution List length is 0, delete the records in Mobile Phase List also
    if (this.impuritiesTest.impuritiesSolutionList.length == 0) {
      // Empty the l
      this.impuritiesTest.impuritiesSolutionTableList = [];
    }
  }

  addNewSolutionTableDetails() {

    this.impuritiesService.addNewSolutionTableDetails(this.impuritiesSubstanceIndex, this.impuritiesTestIndex);

    // IMPORTANT: Need this for Change Detection after assigning new data to dataSource
    this.dataSource = new MatTableDataSource(this.impuritiesService.impurities.impuritiesSubstanceList[this.impuritiesSubstanceIndex]
      .impuritiesTestList[this.impuritiesTestIndex]
      .impuritiesSolutionTableList);
  }

  confirmDeleteImpuritiesSolutionTable(solutionTableIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Solution Table row ' + (solutionTableIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteImpuritiesSolutionTable(solutionTableIndex);
        this.cdr.markForCheck();
      }
    });
  }

  deleteImpuritiesSolutionTable(solutionTableIndex: number) {
    this.impuritiesService.deleteImpuritiesSolutionTable(this.impuritiesSubstanceIndex, this.impuritiesTestIndex, solutionTableIndex);

    // IMPORTANT: Need this for Change Detection after assigning new data to dataSource
    this.dataSource = new MatTableDataSource(this.impuritiesService.impurities.impuritiesSubstanceList[this.impuritiesSubstanceIndex]
      .impuritiesTestList[this.impuritiesTestIndex]
      .impuritiesSolutionTableList);
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
        this.cdr.markForCheck();
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
      this.cdr.markForCheck();
    });
    this.subscriptions.push(substanceSubscribe);
  }

  copyImpuritiesTest() {
    this.impuritiesService.copyImpuritiesTest(this.impuritiesSubstanceIndex, this.impuritiesTest);
  }

  getLetter(index: number): string {
    return this.letters[index];
  }
}