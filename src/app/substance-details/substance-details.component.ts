import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChildren,
  ViewContainerRef,
  QueryList
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubstanceService } from '../substance/substance.service';
import { SubstanceDetail, SubstanceCode, SubstanceRelationship } from '../substance/substance.model';
import { LoadingService } from '../loading/loading.service';
import { MainNotificationService } from '../main-notification/main-notification.service'
import { AppNotification, NotificationType } from '../main-notification/notification.model';
import { NavigationExtras, Router } from '@angular/router';
import { SubstanceDetailsProperty } from '../substance/substance-utilities.model';
import { DynamicComponentLoader } from '../dynamic-component-loader/dynamic-component-loader.service';
import { StructureDetailsComponent } from './structure-details/structure-details.component';
import { SubstanceCardsService } from './substance-cards.service';

@Component({
  selector: 'app-substance-details',
  templateUrl: './substance-details.component.html',
  styleUrls: ['./substance-details.component.scss']
})
export class SubstanceDetailsComponent implements OnInit, AfterViewInit {
  id: string;
  substance: SubstanceDetail;
  substanceDetailsProperties: Array<SubstanceDetailsProperty> = [];
  private propertiesToShow: Array<string> = ['names', 'notes', 'references', 'structure', 'moieties'];
  private propertyDynamicComponentId: { [propertyId: string]: string } = {
    names: 'na',
    notes: 'na',
    references: 'na',
    structure: 'structure-details',
    moieties: 'na'
  };
  @ViewChildren('dynamicComponent', { read: ViewContainerRef }) dynamicComponents: QueryList<ViewContainerRef>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private substanceService: SubstanceService,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private router: Router,
    private dynamicComponentLoader: DynamicComponentLoader,
    private substanceCardsService: SubstanceCardsService
  ) { }

  // use aspirin for initial development a05ec20c-8fe2-4e02-ba7f-df69e5e30248
  ngOnInit() {
    this.loadingService.setLoading(true);
    this.id = this.activatedRoute.snapshot.params['id'];
    this.getSubstanceDetails();
  }

  ngAfterViewInit(): void {
    this.dynamicComponents.changes
      .subscribe(() => {
        this.dynamicComponents.forEach((cRef, index) => {
          this.dynamicComponentLoader
          .getComponentFactory<StructureDetailsComponent>(this.substanceDetailsProperties[index].dynamicComponentId)
            .subscribe(componentFactory => {
              const ref = cRef.createComponent(componentFactory);
              // ref.instance.data = this.substanceDetailsProperties[index].data;
              ref.changeDetectorRef.detectChanges();
            });
        });
      });
  }

  getSubstanceDetails() {
    this.substanceService.getSubstanceDetails(this.id).subscribe(response => {
      if (response) {
        this.substance = response;
        this.substanceDetailsProperties = this.substanceCardsService.getSubstanceDetailsProperties(this.substance);
      } else {
        this.handleSubstanceRetrivalError();
      }
      this.loadingService.setLoading(false);
    }, error => {
      this.loadingService.setLoading(false);
      this.handleSubstanceRetrivalError();
    });
  }

  // private processSubstanceProperties() {
  //   const substanceKeys = Object.keys(this.substance);
  //   substanceKeys.forEach(key => {
  //     if (this[`${key}ToDetailsProperties`]) {
  //       this[`${key}ToDetailsProperties`]();
  //     } else if (this.propertiesToShow.indexOf(key) > -1) {
  //       const property: SubstanceDetailsProperty = {
  //         title: key,
  //         count: this.substance[key].length,
  //         // data: this.substance[key],
  //         dynamicComponentId: this.propertyDynamicComponentId[key]
  //       };
  //       this.substanceDetailsProperties.push(property);
  //     }
  //   });
  // }

  // private codesToDetailsProperties(): void {

  //   const classification: SubstanceDetailsProperty = {
  //     title: 'classification',
  //     count: 0,
  //     // data: [],
  //     dynamicComponentId: 'na'
  //   };

  //   const identifiers: SubstanceDetailsProperty = {
  //     title: 'identifiers',
  //     count: 0,
  //     // data: [],
  //     dynamicComponentId: 'na'
  //   };

  //   if (this.substance.codes && this.substance.codes.length > 0) {
  //     this.substance.codes.forEach(code => {
  //       if (code.comments && code.comments.indexOf('|') > -1) {
  //         classification.count++;
  //         // classification.data.push(code);
  //       } else {
  //         identifiers.count++;
  //         // identifiers.data.push(code);
  //       }
  //     });
  //   }

  //   if (classification.count > 0) {
  //     this.substanceDetailsProperties.push(classification);
  //   }

  //   if (identifiers.count > 0) {
  //     this.substanceDetailsProperties.push(identifiers);
  //   }
  // }

  // private relationshipsToDetailsProperties(): void {
  //   const properties: { [type: string]: SubstanceDetailsProperty } = {};

  //   if (this.substance.relationships && this.substance.relationships.length > 1) {
  //     this.substance.relationships.forEach(relationship => {
  //       const typeParts = relationship.type.split('->');
  //       const property = typeParts[0].trim();
  //       if (property) {
  //         let propertyName: string;
  //         if (property.indexOf('METABOLITE') > -1) {
  //           propertyName = 'metabolites';
  //         } else if (property.indexOf('IMPURITY') > -1) {
  //           propertyName = 'impurities';
  //         } else if (property.indexOf('ACTIVE MOIETY') > -1) {
  //           propertyName = 'active moiety';
  //         }
  //         if (!properties[propertyName]) {
  //           properties[propertyName] = {
  //             title: propertyName,
  //             count: 0,
  //             // data: [],
  //             dynamicComponentId: 'na'
  //           };
  //         }
  //         properties[propertyName].count++;
  //         // properties[propertyName].data.push(relationship);
  //       }
  //     });
  //   }

  //   Object.keys(properties).forEach(key => {
  //     this.substanceDetailsProperties.push(properties[key]);
  //   });
  // }

  private handleSubstanceRetrivalError() {
    const notification: AppNotification = {
      message: 'The web address above is incorrect. You\'re being forwarded to Browse Substances',
      type: NotificationType.error,
      milisecondsToShow: 4000
    };
    this.mainNotificationService.setNotification(notification);
    setTimeout(() => {
      const navigationExtras: NavigationExtras = {
        queryParams: {}
      };
      navigationExtras.queryParams['search_term'] = this.id || null;
      this.router.navigate(['/browse-substance'], navigationExtras);
    }, 5000);
  }
}
