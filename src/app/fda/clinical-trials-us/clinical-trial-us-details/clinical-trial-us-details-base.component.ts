import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { LoadingService } from '@gsrs-core/loading';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../core/utils/utils.service';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { ClinicalTrialUSService } from '../service/clinical-trial-us.service';
import { GeneralService } from '../../service/general.service';
import { Title} from '@angular/platform-browser';

// Archana has template: '' but I get error if I don't have it??
@Component({
  selector: 'app-clinical-trial-us-details-base',
  template: 'clinical-trial-us-details-base.component.html',
  styleUrls: ['./clinical-trial-us-details-base.component.scss']
})
export class ClinicalTrialUSDetailsBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  clinicalTrialUSId: string;
  src = '';
  clinicalTrialUS: any;
  iconSrcPath: string;
  message = '';
  subscriptions: Array<Subscription> = [];

  constructor(
    public clinicalTrialUSService: ClinicalTrialUSService,
    public generalService: GeneralService,
    public activatedRoute: ActivatedRoute,
    public loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private router: Router,
    private gaService: GoogleAnalyticsService,
    private utilsService: UtilsService,
    private titleService: Title
  ) { }

  ngOnInit() {

    this.loadingService.setLoading(true);
    this.clinicalTrialUSId = this.activatedRoute.snapshot.params['trialNumber'];
    // this.kind = this.activatedRoute.snapshot.params['kind'];

    if (this.clinicalTrialUSId != null) {
      this.getClinicalTrialUS();
    } else {
      this.titleService.setTitle(`<> Detail / Clinical Trial`);
      this.handleSubstanceRetrivalError();
    }
    this.loadingService.setLoading(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  ngAfterViewInit() { }

  getClinicalTrialUS(): void {
    const prodSubscription = this.clinicalTrialUSService.getClinicalTrialUS(this.clinicalTrialUSId, this.src).subscribe(response => {
      if (response) {
      this.clinicalTrialUS = response;
      this.titleService.setTitle(`${this.clinicalTrialUS.trialNumber}: Detail / US Clinical Trial / GSRS`);
     // if (Object.keys(this.clinicalTrialUS).length > 0) {
      this.getSubstanceBySubstanceKey();
    //  }
      }
    }, error => {
      this.message = 'No US Clinical Trial record found';
      // this.handleSubstanceRetrivalError();
    });
    this.subscriptions.push(prodSubscription);
  }

  getSubstanceBySubstanceKey() {
    if (this.clinicalTrialUS != null) {
      console.log('getting substanes .... before foreach')

      this.clinicalTrialUS.clinicalTrialUSDrug.forEach(elementSubstance => {
        console.log('getting substanes ....')
        if (elementSubstance != null) {
          // Get Substance Details, uuid, substance name
          if (elementSubstance.substanceKey) {
            console.log('getting substanes .... if substancekey')

            const subSubscription = this.generalService.getSubstanceByAnyId(elementSubstance.substanceKey).subscribe(response => {
              if (response) {
                console.log('getting substanes .... if response')
                elementSubstance._substanceUuid = response.uuid;
                elementSubstance._substanceName = response._name;
              }
            });
            this.subscriptions.push(subSubscription);
          }
        }
      });  // Substance Loop
    }
  }

  // Alex deleted some of Archana's  commented out code here.

  private handleSubstanceRetrivalError() {
    this.loadingService.setLoading(false);
    const notification: AppNotification = {
      message: 'The web address above is incorrect. You\'re being forwarded to Browse Substances',
      type: NotificationType.error,
      milisecondsToShow: 4000
    };
    this.mainNotificationService.setNotification(notification);
    setTimeout(() => {
      this.router.navigate(['/browse-substance']);
    }, 5000);
  }

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    return this.utilsService.getSafeStructureImgUrl(structureId, size, true);
  }


}
