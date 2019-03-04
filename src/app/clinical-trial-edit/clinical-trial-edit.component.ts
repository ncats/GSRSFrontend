import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClinicalTrialService } from '../clinical-trial/clinical-trial.service';
import { ClinicalTrial, BdnumNameAll } from '../clinical-trial/clinical-trial.model';
import { ClinicalTrialDrug } from '../clinical-trial/clinical-trial.model';
import { MiniSearchComponent } from '../mini-search/mini-search.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConfigService } from '../config/config.service';
import * as _ from 'lodash';
import { LoadingService } from '../loading/loading.service';
import { MainNotificationService } from '../main-notification/main-notification.service';
import { AppNotification, NotificationType } from '../main-notification/notification.model';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { stringify } from '@angular/core/src/render3/util';

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
  displayedColumns: string[] = ['id', 'name', 'bdnum', 'Delete'];
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
    private notificationService: MainNotificationService
  ) { }

  ngOnInit() {
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
    this.dataSource.data = this.dataSource.data;
    // console.log("data2:" + JSON.stringify(this._bdnumNameAll));
  }

  addRow() {
    let model = { id: '', name:'',  bdnum: ''};
    this.dataSource.data.push(model);
    // why? 
    this.dataSource.data=this.dataSource.data;
    // console.log('hey man');    
    // console.log(this.dataSource.data);
  }
  removeRow(i) {
    let model = { id: '', name:'',  bdnum: ''};
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
    var that = this;
    var myData=[];
    this.loadingService.setLoading(true);
    console.log("xyz: "  + this._nctNumber);
    this.clinicalTrialService.getClinicalTrial(this._nctNumber)
      .subscribe( data => {
        this.isError = false;
        data.clinicalTrialDrug.forEach(element => {
          console.log("xxx: " + JSON.stringify(element));
          this.dataSource.data.push(
            {
//           nctNumber: element.nctNumber,
//           nctNumber: this._nctNumber,
             id: element.id,
              bdnum: element.bdnum,
              name: element.bdnumName.name
            }
          );
        });
        // Weird, why is this necessary?

        this.clinicalTrial=data;
        this.dataSource.data = this.dataSource.data;
        console.log(JSON.stringify(this.dataSource.data));        
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

  // this needs testing.

  updateClinicalTrial() {
    var that = this;
    var myData=[];
    this.loadingService.setLoading(true);
    let newClinicalTrial = _.cloneDeep(this.clinicalTrial);
    let newClinicalTrialDrugs: Array<ClinicalTrialDrug> = [];

    this.dataSource.data.forEach((element, index)  => {
      let ctd = {} as ClinicalTrialDrug;
      ctd.nctNumber=element.nctNumber;
      ctd.bdnum=element.bdnum;
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
              bdnum: element.bdnum,
              name: element.bdnumName.name
            }
          );
          // Weird, why is this necessary?
          this.clinicalTrial = data;
          this.dataSource.data = this.dataSource.data;
          console.log(JSON.stringify(this.dataSource.data));
        });
      }, error => {
        // what should we do on error? 
        const notification: AppNotification = {
          message: 'There was an error trying to update clinical trial.',
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


export interface ClinicalTrialDrugSimple {
  // nctNumber: string;
  id: number;
  ingredientName: string;
  bdnum: string;
}