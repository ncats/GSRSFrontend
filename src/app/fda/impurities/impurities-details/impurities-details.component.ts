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
  selector: 'app-impurities-details',
  templateUrl: './impurities-details.component.html',
  styleUrls: ['./impurities-details.component.scss']
})
export class ImpuritiesDetailsComponent implements OnInit {

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
      this.getImpurities();
    } else {
      this.handleSubstanceRetrivalError();
    }
    this.loadingService.setLoading(false);
  }

  getImpurities(): void {
    this.impuritiesService.getImpurities(this.id).subscribe(response => {
      this.impurities = response;
      if (Object.keys(this.impurities).length > 0) {

        // Get Substance Name for SubstanceUuid in SubstanceList
        this.impurities.impuritiesSubstanceList.forEach((elementRel, indexRel) => {
          if (elementRel.substanceUuid) {
            this.impuritiesService.getSubstanceDetailsBySubstanceId(elementRel.substanceUuid).subscribe(substanceNames => {
              elementRel.substanceName = substanceNames.name;
            });
          }
        });

        // Get Substance Name for RelatedSubstanceUuid in ImpuritiesSubstanceList
        this.impurities.impuritiesTestList.forEach((elementTest, indexTes) => {
          elementTest.impuritiesDetailsList.forEach((elementDetails, indexDetails) => {
            if (elementDetails.relatedSubstanceUuid) {
              this.impuritiesService.getSubstanceDetailsBySubstanceId(elementDetails.relatedSubstanceUuid).subscribe(substanceNames => {
                elementDetails.substanceName = substanceNames.name;
              });
            }
          });
        });
      }
    }, error => {
      this.handleSubstanceRetrivalError();
    });
  }

  getSubstancePreferredName(substanceUuid: string) {
    let name = '';
    this.impuritiesService.getSubstanceDetailsBySubstanceId(substanceUuid).subscribe(substanceNames => {
      name = substanceNames.name;
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
    const testIndex = 0;
    const testList = this.impurities.impuritiesTestList[testIndex];
    testList.impuritiesDetailsList.forEach((elementRel, indexRel) => {
      const relSubUuid = elementRel.relatedSubstanceUuid;

      this.impuritiesService.getSubstanceDetailsBySubstanceId(relSubUuid).subscribe(substanceNames => {
        //  console.log(JSON.stringify(substanceNames));
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
