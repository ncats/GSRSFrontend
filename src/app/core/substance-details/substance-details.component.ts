import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChildren,
  ViewContainerRef,
  QueryList,
  ViewChild,
  OnDestroy,
  HostListener
} from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { SubstanceService } from '../substance/substance.service';
import { SubstanceDetail } from '../substance/substance.model';
import { LoadingService } from '../loading/loading.service';
import { MainNotificationService } from '../main-notification/main-notification.service';
import { AppNotification, NotificationType } from '../main-notification/notification.model';
import { SubstanceDetailsProperty } from '../substance/substance-utilities.model';
import { DynamicComponentLoader } from '../dynamic-component-loader/dynamic-component-loader.service';
import { SubstanceCardsService } from './substance-cards.service';
import { MatSidenav } from '@angular/material/sidenav';
import { UtilsService } from '../utils/utils.service';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { environment } from '../../../environments/environment';
import {Subject, Subscription} from 'rxjs';

@Component({
  selector: 'app-substance-details',
  templateUrl: './substance-details.component.html',
  styleUrls: ['./substance-details.component.scss']
})
export class SubstanceDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  id: string;
  version: number;
  latestVersion: number;
  termSubscriber: Subscription;
  substance: SubstanceDetail;
  substanceDetailsProperties: Array<SubstanceDetailsProperty> = [];
  @ViewChildren('dynamicComponent', { read: ViewContainerRef }) dynamicComponents: QueryList<ViewContainerRef>;
  @ViewChild('matSideNavInstance', { static: true }) matSideNav: MatSidenav;
  hasBackdrop = false;
  substanceUpdated = new Subject<SubstanceDetail>();
  constructor(
    private activatedRoute: ActivatedRoute,
    private substanceService: SubstanceService,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private dynamicComponentLoader: DynamicComponentLoader,
    private substanceCardsService: SubstanceCardsService,
    private utilsService: UtilsService,
    private gaService: GoogleAnalyticsService,
    private activeRoute: ActivatedRoute
  ) { }

  // use aspirin for initial development a05ec20c-8fe2-4e02-ba7f-df69e5e30248
  ngOnInit() {
    this.gaService.sendPageView(`Substance Details`);
    this.id = this.activatedRoute.snapshot.params['id'];
    this.version = this.activatedRoute.snapshot.params['version'];
    this.loadingService.setLoading(true);
     this.checkVersion().subscribe((result: number) => {this.latestVersion = result;
       this.activeRoute.params.subscribe(routeParams => {
         this.id = routeParams.id;
         this.version = routeParams.version;
         if (this.version) {
           if (Number(this.latestVersion) > Number(this.version)) {
             this.getSubstanceDetails(this.id, this.version.toString());
           } else {
             this.getSubstanceDetails(this.id);
           }
         } else {
           this.getSubstanceDetails(this.id);
         }

       });

     });


  }



  ngAfterViewInit(): void {



    this.dynamicComponents.changes
      .subscribe(() => {
        this.dynamicComponents.forEach((cRef, index) => {
          const substanceProperty = this.substanceDetailsProperties[index];
          if (!substanceProperty.isLoaded) {
            substanceProperty.isLoaded = true;
            this.dynamicComponentLoader
              .getComponentFactory<any>(substanceProperty.dynamicComponentId)
              .subscribe(componentFactory => {
                const ref = cRef.createComponent(componentFactory);
                ref.instance.countUpdate.subscribe(count => {
                  substanceProperty.updateCount(count);
                });
                ref.instance.substance = this.substance;
                ref.instance.substanceUpdated = this.substanceUpdated.asObservable();
                ref.instance.title = substanceProperty.title;
                ref.instance.analyticsEventCategory = !environment.isAnalyticsPrivate
                  && this.utilsService.toCamelCase(`substance ${substanceProperty.title}`)
                  || 'substanceCard';
                if (substanceProperty.type != null) {
                  ref.instance.type = substanceProperty.type;
                }
                ref.changeDetectorRef.detectChanges();
                this.substanceUpdated.next(this.substance);
              });
          }
        });
      });
    this.matSideNav.openedStart.subscribe(() => {
      this.utilsService.handleMatSidenavOpen(1100);
    });
    this.matSideNav.closedStart.subscribe(() => {
      this.utilsService.handleMatSidenavClose();
    });

    setTimeout(() => {
      this.processResponsiveness();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.processResponsiveness();
  }

  ngOnDestroy() {
    // window.removeEventListener('resize', this.processResponsiveness);
  }
  checkVersion() {
    return this.substanceService.checkVersion(this.id);
  }


  getSubstanceDetails(id: string, version?: string) {
    this.substanceService.getSubstanceDetails(id, version).subscribe(response => {
      if (response) {
        this.substance = response;
        this.substanceUpdated.next(response);
        this.substanceCardsService.getSubstanceDetailsPropertiesAsync(this.substance).subscribe(substanceProperty => {
          if (substanceProperty != null) {
            this.insertSubstanceProperty(substanceProperty);
          }
        });
      } else {
        this.handleSubstanceRetrivalError();
      }
      this.loadingService.setLoading(false);
    }, error => {
      this.gaService.sendException('getSubstanceDetails: error from API call');
      this.loadingService.setLoading(false);
      this.handleSubstanceRetrivalError();
    });
  }

  private insertSubstanceProperty(property: SubstanceDetailsProperty, startVal?: number, endVal?: number): void {
    const length = this.substanceDetailsProperties.length;
    const start = startVal != null ? startVal : 0;
    const end = endVal != null ? endVal : length - 1;
    const m = start + Math.floor((end - start) / 2);


    if (length === 0) {
      this.substanceDetailsProperties.push(property);
      return;
    }
    if (property.order > this.substanceDetailsProperties[end].order) {
      this.substanceDetailsProperties.splice(end + 1, 0, property);
      return;
    }

    if (property.order < this.substanceDetailsProperties[start].order) {
      this.substanceDetailsProperties.splice(start, 0, property);
      return;
    }

    if (start >= end) {
      return;
    }

    if (property.order < this.substanceDetailsProperties[m].order) {
      this.insertSubstanceProperty(property, start, m - 1);
      return;
    }

    if (property.order > this.substanceDetailsProperties[m].order) {
      this.insertSubstanceProperty(property, m + 1, end);
      return;
    }
  }

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

  private processResponsiveness = () => {
    if (window) {
      if (window.innerWidth < 1100) {
        this.matSideNav.close();
        this.hasBackdrop = true;
      } else {
        this.matSideNav.open();
        this.hasBackdrop = false;
      }
    }
  }

  openSideNav() {
    this.gaService.sendEvent('substanceNav', 'button:sidenav', 'open');
    this.matSideNav.open();
  }

  handleSidenavClick(substancePropertyTitle: string): void {

    const eventLabel = environment.isAnalyticsPrivate ? 'substance card' : substancePropertyTitle;

    this.gaService.sendEvent('substanceNav', 'link:nav-to', eventLabel);

    if (window && window.innerWidth < 1100) {
      this.matSideNav.close();
      this.hasBackdrop = true;
    }
  }
}
