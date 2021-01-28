import { Component, OnInit } from '@angular/core';
import { Impurities, ImpuritiesDetails, ImpuritiesUnspecified, SubRelationship, ValidationMessage } from '../model/impurities.model';
import { ImpuritiesService } from '../service/impurities.service';
import { GeneralService } from '../../service/general.service';
import { LoadingService } from '@gsrs-core/loading';
import { UtilsService } from '../../../core/utils/utils.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-impurities-view',
  templateUrl: './impurities-view.component.html',
  styleUrls: ['./impurities-view.component.scss']
})
export class ImpuritiesViewComponent implements OnInit {

  id: string;
  impurities: Impurities;
  substanceName = '';
  flagIconSrcPath: string;
  isAdmin = false;
  updateApplicationUrl: string;
  message = '';
  subRelationship: any;

  constructor(
    private impuritiesService: ImpuritiesService,
    private generalService: GeneralService,
    private activatedRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private router: Router,
    private gaService: GoogleAnalyticsService,
    private utilsService: UtilsService,
  ) { }

  ngOnInit() {
    this.loadingService.setLoading(true);
    this.id = this.activatedRoute.snapshot.params['id'];
    if (this.id != null) {
      this.getProduct();
    } else {
      this.handleSubstanceRetrivalError();
    }
  }

  getProduct(): void {
    this.impuritiesService.getImpurities(this.id).subscribe(response => {
      this.impurities = response;
      if (Object.keys(this.impurities).length > 0) {
        //  this.substanceName = this.generalService.getSubstancePreferredName(this.impurities.substanceUuid);
        this.getSubstancePreferredName(this.impurities.substanceUuid);
        this.getRelationship();
        //  this.getImpuritiesRelationship();
        //  if ((this.src != null) && (this.src === 'srs')) {
        // //    this.getSubstanceDetails();
        //  }
      }
      this.loadingService.setLoading(false);
    }, error => {
      this.handleSubstanceRetrivalError();
    });
  }

  getSubstancePreferredName(substanceUuid: string): void {
    this.impuritiesService.getSubstanceDetailsBySubstanceId(substanceUuid).subscribe(substanceNames => {
      this.substanceName = substanceNames.name;
    });

  }

  /*
  getImpuritiesRelationship(): void {
    this.impuritiesService.getRelationshipImpurity(this.impurities.substanceUuid).subscribe(response => {
      if (response) {
        this.subRelationship = response.data;
        this.getRelationship();
        //  this.impurity.impuritiesList[0].relationshipList = response[0];
        console.log(JSON.stringify(this.subRelationship));
        //  alert(this.subRelationship.length);
      }
    });
  }
  */

  getRelationship(): void {
    // alert(this.subRelationship.length);
    this.impurities.impuritiesDetailsList.forEach((elementRel, indexRel) => {
      const relSubUuid = elementRel.relatedSubstanceUuid;

      console.log(relSubUuid);

      this.impuritiesService.getSubstanceDetailsBySubstanceId(relSubUuid).subscribe(substanceNames => {
        console.log(JSON.stringify(substanceNames));
        elementRel.substanceName = substanceNames.name;
      });

    });

  }


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
