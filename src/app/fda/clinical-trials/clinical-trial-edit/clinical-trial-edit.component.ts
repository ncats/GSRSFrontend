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
  defaultSubstanceKeyType = 'UUID';
  agencySubstanceKeyType = 'UUID';

  isAdmin: boolean;
  isTesting  = true;
  displayedColumns: string[];
  dataSource = new MatTableDataSource([]);
  public  _trialNumber: string;
  bulkInputValue = '';
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
    this.authService.hasAnyRolesAsync('Admin', 'Updater', 'SuperUpdater').subscribe(response => {
      this.isAdmin = response;
      // __alex__ turning for for gsrs3 testing
      this.isAdmin = true;
      if (this.isAdmin) {
        this.displayedColumns = ['id', 'name', 'substanceKey', 'protectedMatch', 'link', 'delete'];
       } else {
         this.displayedColumns = ['name', 'substanceKey', 'protectedMatch', 'link'];
       }
    });
    this.pageSize = 10;
    this.pageIndex = 0;
    /*
    this.activatedRoute
      .queryParamMap
      .subscribe(params => {
        this._trialNumber = params.get('trialNumber') || '';
        this.getClinicalTrial();
      });
    */

        this.activatedRoute.paramMap.subscribe(params => {
        this._trialNumber = params.get('trialNumber');
        this.getClinicalTrial();
      });
  }

  reportMiniSearchOutput(data) {
   this.clinicalTrialService.getSubstanceDetailsFromName(data.value).subscribe(
    substanceDetails => {
      if (substanceDetails === null
          || substanceDetails.content === null
          || substanceDetails.content[0] === null
//          || substanceDetails.content[0].name===String('NULL')
//          || substanceDetails.content[0].name===String('null')
        ) {
          this.dataSource.data[data.myIndex].substanceKey = null;
        } else {
          this.dataSource.data[data.myIndex].name = data.value;
          this.dataSource.data[data.myIndex].substanceKey = substanceDetails.content[0].uuid;
        }
    }, () => {
      this.dataSource.data[data.myIndex].substanceKey = null;
    }
);
    this.dataSource.data = this.dataSource.data;
  }

  // need to work on this from config.
  addRow() {
    const model = { id: '', name: '', substanceKey: '', substanceKeyType: this.defaultSubstanceKeyType };
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
    this.clinicalTrialService.getClinicalTrial(this._trialNumber)
      .subscribe( data => {
        this.isError = false;
        data.clinicalTrialDrug.forEach(element => {
          this.dataSource.data.push({
             id: element.id,
             substanceKey: element.substanceKey,
             substanceKeyType: element.substanceKeyType,
             name: element.substanceDisplayName,
             protectedMatch: element.protectedMatch
            }
          );
        });
        // Weird, why is this necessary?
        this.clinicalTrial = data;
        this.dataSource.data = this.dataSource.data;
      }, () => {
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
    this.dataSource.data.forEach((element)  => {
      const ctd = {} as ClinicalTrialDrug;
      ctd.id = element.id;
      ctd.trialNumber = element.trialNumber;
      ctd.substanceKey = element.substanceKey;
      ctd.substanceKeyType = element.substanceKeyType;
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
              substanceKey: element.substanceKey,
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
          if (error.error.errors !== undefined && error.error.errors !== null) {
         error.error.errors.forEach(element => {
           if (element) {
             message = message + ' ' + element;
           }
         });
          }
          if (error.error.validationMessages !== undefined  && error.error.validationMessages !== null) {
          error.error.validationMessages.forEach(element => {
            if (element.message !== null) {
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
        console.log('Inside empty add method.');
      });
  }

    copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
//    inputElement.setSelectionRange(0, 0);
//    this.textMessageFunc('Text');
  }

  substancesToClipboard1a() {
      const textArray = [];
      this.dataSource.data.forEach(element => {
        textArray.push(element.substanceKey);
      });
      this.copyTextAreaToClipBoard(textArray.join('\n'));
    }
    substancesToClipboard1b() {
      const textArray = [];
      this.dataSource.data.forEach(element => {
        textArray.push(element.substanceKey);
      });
      this.copyTextAreaToClipBoard(textArray.join('; '));
    }


    substancesToClipboard2a() {
      const textArray = [];
      this.dataSource.data.forEach(element => {
        textArray.push(element.name + '\t' + element.substanceKey);
      });
      this.copyTextAreaToClipBoard(textArray.join('\n'));
    }

    substancesToClipboard2b() {
      const textArray1 = [];
      const textArray2 = [];
      this.dataSource.data.forEach(element => {
        textArray1.push(element.name);
        textArray2.push(element.substanceKey);
      });
      this.copyTextAreaToClipBoard(textArray1.join('; ') + '\t' + textArray2.join('; '));
    }

    substancesToClipboard3a() {
      const textArray = [];
      this.dataSource.data.forEach(element => {
        textArray.push(this._trialNumber + '\t' + element.name + '\t' + element.substanceKey);
      });
      this.copyTextAreaToClipBoard(textArray.join('\n'));
    }

    substancesToClipboard3b() {
      const textArray1 = [];
      const textArray2 = [];
      this.dataSource.data.forEach(element => {
        textArray1.push(element.name);
        textArray2.push(element.substanceKey);
      });
      this.copyTextAreaToClipBoard(this._trialNumber + '\t' + textArray1.join('; ') + '\t' + textArray2.join('; '));
    }


    copyTextAreaToClipBoard(message: string) {
      const cleanText = message.replace(/<\/?[^>]+(>|$)/g, '');
      const x = document.createElement('TEXTAREA') as HTMLTextAreaElement;
      x.value = cleanText;
      document.body.appendChild(x);
      x.select();
      document.execCommand('copy');
      document.body.removeChild(x);
    }
} // end class
