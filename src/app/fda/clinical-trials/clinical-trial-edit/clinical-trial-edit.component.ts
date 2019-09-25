import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { stringify } from '@angular/core/src/render3/util';
import {AuthService} from '@gsrs-core/auth/auth.service';
import { pipes2Br } from '../filters/pipes-2-br';

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
  miniSearchOutputReported='';
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private clinicalTrialService: ClinicalTrialService,
    private sanitizer: DomSanitizer,
    public configService: ConfigService,
    private loadingService: LoadingService,
    private notificationService: MainNotificationService,
    private authService: AuthService,

  ) { 
  }

  ngOnInit() {
    this.authService.hasRolesAsync('admin').subscribe(response => {
      this.isAdmin = response;
      console.log("clinical-trial-edit isAdmin: " +this.isAdmin);

      if(this.isAdmin) {
        this.displayedColumns=['id', 'name', 'substanceUuid', 'protectedMatch', 'link', 'delete'];
       } else {
         this.displayedColumns=['name', 'substanceUuid', 'protectedMatch', 'link'];
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
        this._nctNumber = params.get("nctNumber");
        this.getClinicalTrial();       
      })
  }

  reportMiniSearchOutput(data) {
    console.log("doing reportMiniSearchOutput");
    console.log("data:" + JSON.stringify(data));
    /*
    this.clinicalTrialService.getBdnumNameAll(data.value).subscribe(
        bdnumNameAll => {
          if(bdnumNameAll==null) {
            this.dataSource.data[data.myIndex].bdnum=null;
            console.log("here1");
          } else {
            // there is a fake substance called "NULL", LOL
            if(bdnumNameAll.name===String("NULL")) {
              this.dataSource.data[data.myIndex].bdnum=null;
              console.log("here2.1");
            } else {
              this.dataSource.data[data.myIndex].name=data.value;
              this.dataSource.data[data.myIndex].bdnum=bdnumNameAll.bdnum;
              console.log("data2.2:" + JSON.stringify(bdnumNameAll));
            }
          }
        }, error => {
          this.dataSource.data[data.myIndex].bdnum=null;
          console.log("here3");

        }
    );
    */
 
   this.clinicalTrialService.getSubstanceDetailsFromName(data.value).subscribe(
    substanceDetails => {
      if(substanceDetails==null 
          || substanceDetails.content==null 
          || substanceDetails.content[0]==null  
//          || substanceDetails.content[0].name===String("NULL")
//          || substanceDetails.content[0].name===String("null")
        ) {
          this.dataSource.data[data.myIndex].substanceUuid=null;
          console.log("here1: "+ console.log(JSON.stringify(data.value)));
        } else {
          this.dataSource.data[data.myIndex].name=data.value;
          this.dataSource.data[data.myIndex].substanceUuid=substanceDetails.content[0].uuid;
          console.log("data2.2:" + JSON.stringify(substanceDetails));
        }
    }, error => {
      this.dataSource.data[data.myIndex].substanceUuid=null;
      console.log("here3");
    }
);
    this.dataSource.data = this.dataSource.data;
    // console.log("data2:" + JSON.stringify(this._bdnumNameAll));
  }

  addRow() {
    let model = { id: '', name:'',  substanceUuid: ''};
    this.dataSource.data.push(model);
    // why? 
    this.dataSource.data=this.dataSource.data;
    // console.log('hey man');    
    // console.log(this.dataSour  ce.data);
  }
  removeRow(i) {
    let model = { id: '', name:'',  substanceUuid: ''};
    this.dataSource.data.splice(i,1);
    this.dataSource.data=this.dataSource.data;
    // console.log('hey man');    
    // console.log(this.dataSource.data);
  }
  



  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  getClinicalTrial() {
    console.log()
    var that = this;
    var myData=[];
    this.loadingService.setLoading(true);
    console.log("xyz: "  + this._nctNumber);
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

        this.clinicalTrial=data;
        this.dataSource.data = this.dataSource.data;
        console.log("def" + JSON.stringify(this.dataSource.data));
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
/*
      this.dataSource.data.forEach(element => {
        var nameHolder;
        that.clinicalTrialService.getSubstanceDetailsFromUUID(
          element.bdnum
        )
          .subscribe( data => {
         console.log("_name xyz n:"+ element.bdnum + "d: " + data._name);   
         nameHolder=data._name;
          }, error => {
          });
          this.dataSource.data[myIndex].name=nameHolder;  
        });  
        this.dataSource.data=this.dataSource.data;

*/

  }


  mytest2(uuid)  {
    let x = null;
    this.clinicalTrialService.getSubstanceDetailsFromUUID(uuid)
    .subscribe(detailsResponse => {
      console.log("Getting name");
      console.log(detailsResponse);
      if(detailsResponse._name!=null) {
        x = detailsResponse._name;
        console.log(x);
      } else {
        console.log("Was null bxc");
      }
    }, error => {
      x = "ERROR";
      console.log("There was an error getting details");
     }, () => {
    });
    return x;
  }



  // this needs testing.

  updateClinicalTrial() {
    var that = this;
    var myData=[];
    this.loadingService.setLoading(true);
    let newClinicalTrial = _.cloneDeep(this.clinicalTrial);
    let newClinicalTrialDrugs: Array<ClinicalTrialDrug> = [];

    this.dataSource.data.forEach((element, index)  => {
      let ctd = {} as ClinicalTrialDrug;
      ctd.id=element.id;
      ctd.nctNumber=element.nctNumber;
      ctd.substanceUuid=element.substanceUuid;
      ctd.protectedMatch=element.protectedMatch;
      newClinicalTrialDrugs.push(ctd);
    });
    newClinicalTrial.clinicalTrialDrug=newClinicalTrialDrugs;
    console.log(JSON.stringify(newClinicalTrial));
    
    this.clinicalTrialService.updateClinicalTrial(
      newClinicalTrial
    )
      .subscribe( data => {
        this.isError = false;
        this.dataSource.data=[];
        data.clinicalTrialDrug.forEach(element => {
          console.log("xxx: " + JSON.stringify(element));
          this.dataSource.data.push(
            {
            // nctNumber: element.nctNumber,
              // nctNumber: this._nctNumber,
              id: element.id,
              substanceUuid: element.substanceUuid,
              name: element.substanceDisplayName,
              protectedMatch: element.protectedMatch
            }
          );
          // Weird, why is this necessary?
          this.clinicalTrial = data;
          this.dataSource.data = this.dataSource.data;
          console.log(JSON.stringify(this.dataSource.data));
        });
        var message = "Success";
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
        // what should we do on error? 
        console.log("testing errors:" + JSON.stringify(error.error.errors));
        
        var message = 'There was an error trying to update clinical trial.';
        var noChange = false;

        if(error.error.errors!=null) {
         error.error.errors.forEach(element => {
           if(element) {
             message = message + " " + element;
             console.log(element);
           }    
         });
        }
        if(error.error.validationMessages!=null) {
          error.error.validationMessages.forEach(element => {
            if(element.message!=null) {
              message = message + " " + element.message;
              console.log(element.message);
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
      });
  }

} // end class

// I think this can be deleted. 
/*
export interface ClinicalTrialDrugSimple {
  // nctNumber: string;
  id: number;
  ingredientName: string;
  substanceUuid: string;
}
*/