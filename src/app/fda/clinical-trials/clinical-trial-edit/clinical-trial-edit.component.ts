import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { ClinicalTrialService } from '../clinical-trial/clinical-trial.service';
import { ClinicalTrial, BdnumNameAll } from '../clinical-trial/clinical-trial.model';
import { ClinicalTrialDrug } from '../clinical-trial/clinical-trial.model';
import { MiniSearchComponent } from '../mini-search/mini-search.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConfigService } from '@gsrs-core/config';
import * as _ from 'lodash';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {AuthService} from '@gsrs-core/auth/auth.service';
import { Pipes2Br } from '../filters/pipes-2-br';

// import { Auth } from '../../../core/auth/auth.model';


/**
 * @title Table with editing
 */

@Component({
  selector: 'app-clinical-trial-edit',
  templateUrl: './clinical-trial-edit.component.html',
  styleUrls: ['./clinical-trial-edit.component.scss']
})
export class ClinicalTrialEditComponent implements OnInit {
  clinicalTrial: ClinicalTrial;
  // 'nctNumber',
  isAdmin: boolean;
  isTesting  = false;
  displayedColumns: string[];
  dataSource = new MatTableDataSource([]);
  public  _nctNumber: string;


  // public facets: Array<Facet> = [];
  // private _facetParams: { [facetName: string]: { [facetValueLabel: string]: boolean } } = {};
  pageIndex: number;
  pageSize: number;
  totalClinicalTrials: number;
  isLoading = true;
  isError = false;
  model = {};
  miniSearchOutputReported = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private clinicalTrialService: ClinicalTrialService,
    private sanitizer: DomSanitizer,
    public configService: ConfigService,
    private loadingService: LoadingService,
    private notificationService: MainNotificationService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.authService.hasRolesAsync('admin').subscribe(response => {
      this.isAdmin = response;
      if (this.isTesting) {
      }
      if (this.isAdmin) {
        this.displayedColumns = ['id', 'name', 'substanceUuid', 'protectedMatch', 'link', 'delete'];
       } else {
         this.displayedColumns = ['name', 'substanceUuid', 'protectedMatch', 'link'];
       }
    });
    this.pageSize = 10;
    this.pageIndex = 0;
    /*
    this.activatedRoute
      .queryParamMap
      .subscribe(params => {
        this._nctNumber = params.get('nctNumber') || '';
        this.getClinicalTrial();
      });
    */

        this.activatedRoute.paramMap.subscribe(params => {
        this._nctNumber = params.get('nctNumber');
        this.getClinicalTrial();
      });
  }

  reportMiniSearchOutput(data) {
   this.clinicalTrialService.getSubstanceDetailsFromName(data.value).subscribe(
    substanceDetails => {
      if (substanceDetails == null
          || substanceDetails.content == null
          || substanceDetails.content[0] == null
//          || substanceDetails.content[0].name===String('NULL')
//          || substanceDetails.content[0].name===String('null')
        ) {
          this.dataSource.data[data.myIndex].substanceUuid = null;
        } else {
          this.dataSource.data[data.myIndex].name = data.value;
          this.dataSource.data[data.myIndex].substanceUuid = substanceDetails.content[0].uuid;
        }
    }, error => {
      this.dataSource.data[data.myIndex].substanceUuid = null;

    }
);
    this.dataSource.data = this.dataSource.data;
  }

  addRow() {
    const model = { id: '', name: '',  substanceUuid: ''};
    this.dataSource.data.push(model);
    // why?
    this.dataSource.data = this.dataSource.data;
  }

  removeRow(i) {
    this.dataSource.data.splice(i, 1);
    this.dataSource.data = this.dataSource.data;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getClinicalTrial() {
    this.loadingService.setLoading(true);
    this.dataSource.data = [];
    this.clinicalTrialService.getClinicalTrial(this._nctNumber)
      .subscribe( data => {
        this.isError = false;
        data.clinicalTrialDrug.forEach(element => {
          this.dataSource.data.push({
             id: element.id,
             substanceUuid: element.substanceUuid,
             name: element.substanceDisplayName,
             protectedMatch: element.protectedMatch
            }
          );
        });
        // Weird, why is this necessary?
        this.clinicalTrial = data;
        this.dataSource.data = this.dataSource.data;
      }, error => {
        const notification: AppNotification = {
          message: 'There was an error trying to retrieve clinical trial. Please refresh and try again.',
          type: NotificationType.error,
          milisecondsToShow: 6000
        };
        this.isError = true;
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
        this.notificationService.setNotification(notification);
      }, () => {
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
      });
  }

  updateClinicalTrial() {
    // var that = this;
    this.loadingService.setLoading(true);
    const newClinicalTrial = _.cloneDeep(this.clinicalTrial);
    const newClinicalTrialDrugs: Array<ClinicalTrialDrug> = [];
    // let newNctNumber: string;
    this.dataSource.data.forEach((element, index)  => {
      const ctd = {} as ClinicalTrialDrug;
      ctd.id = element.id;
      ctd.nctNumber = element.nctNumber;
      ctd.substanceUuid = element.substanceUuid;
      ctd.protectedMatch = element.protectedMatch;
      newClinicalTrialDrugs.push(ctd);
    });
    newClinicalTrial.clinicalTrialDrug = newClinicalTrialDrugs;
    this.clinicalTrialService.updateClinicalTrial(
      newClinicalTrial
    )
      .subscribe( data => {
        this.getClinicalTrial();
        // the code below in the if (0) { ... } used to work by relying on the data reponse
        // from the PUT, but for some reason, now, data from prior to the update would
        // sneak back into the edit component. Thefore, for now, I am reloading
        // the data with the GET after a successful update.
        if (0) {
        this.isError = false;
        this.dataSource.data = [];
        data.clinicalTrialDrug.forEach(element => {
          this.dataSource.data.push(
            {
              id: element.id,
              substanceUuid: element.substanceUuid,
              name: element.substanceDisplayName,
              protectedMatch: element.protectedMatch
            }
          );
          // Weird, why is this necessary?
          this.clinicalTrial = data;
          this.dataSource.data = this.dataSource.data;
        });
        }

        const message = 'Success';
        const notification: AppNotification = {
          message: message,
          type: NotificationType.success,
          milisecondsToShow: 6000
        };
        this.isError = false;
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
        this.notificationService.setNotification(notification);
      }, error => {
        let message = 'There was an error trying to update clinical trial.';
        const noChange = false;
        if (error.error.errors != null) {
         error.error.errors.forEach(element => {
           if (element) {
             message = message + ' ' + element;
           }
         });
        }
        if (error.error.validationMessages != null) {
          error.error.validationMessages.forEach(element => {
            if (element.message != null) {
              message = message + ' ' + element.message;
            }
         });
        }
        const notification: AppNotification = {
          message: message,
          type: NotificationType.error,
          milisecondsToShow: 6000
        };
        this.isError = true;
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
        this.notificationService.setNotification(notification);
      }, () => {
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
      }).add(() => {
      });
  }

} // end class
