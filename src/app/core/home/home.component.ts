import { Component, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { ConfigService, LoadedComponents } from '@gsrs-core/config';
import { Environment } from 'src/environments/environment.model';
import { AuthService } from '@gsrs-core/auth';
import { Router, NavigationExtras } from '@angular/router';
import { SubstanceService } from '@gsrs-core/substance';
import { take } from 'rxjs/operators';
import { MatDialog, MatSidenav } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';
import { UtilsService } from '@gsrs-core/utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  environment: Environment;
  baseDomain: string;
  isAuthenticated = false;
  contactEmail: string;
  isClosedWelcomeMessage = true;
  imageLoc: any;
  appId: string;
  customLinks: Array<any>;
  total: string;
  isCollapsed = true;
  hasBackdrop = false;
  bannerMessage?: string;
  usefulLinks?: Array<any>;
  excelCard?: any;
  
  
  // these may be necessary due to a strange quirk
  // of angular and ngif
  searchValue: string;
  loadedComponents: LoadedComponents;
  
  
  private overlayContainer: HTMLElement;
  @ViewChild('matSideNavInstance', { static: true }) matSideNav: MatSidenav;


  browseAll: string;
  application: string;
  chemicon: string;
  clasicBaseHref: string;

  // Config for Adverse Event on Shiny Server
  adverseEventShinyHomepageDisplay = false;
  adverseEventShinyHomepageURL: string;

  constructor(
    private gaService: GoogleAnalyticsService,
    private configService: ConfigService,
    private authService: AuthService,
    private substanceService: SubstanceService,
    private router: Router,
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer,
    public utilsService: UtilsService,

  ) {
    this.contactEmail = this.configService.configData.contactEmail;
    this.clasicBaseHref = this.configService.environment.clasicBaseHref;
  }

  ngOnInit() {
    this.environment = this.configService.environment;
    this.application = `${this.configService.environment.baseHref || ''}assets/icons/home/icon_application.png`;
    this.browseAll = `${this.configService.environment.baseHref || ''}assets/icons/home/icon_browseall.png`;
    this.chemicon = `${this.configService.environment.baseHref || ''}assets/icons/home/icon_registersubstance.png`;

    this.appId = this.configService.environment.appId;
    this.bannerMessage = this.configService.configData.bannerMessage || null;
    this.loadedComponents = this.configService.configData.loadedComponents || null;
    // this code cause memory errors in the build process
    /*let notempty = false;
    for (const property in this.loadedComponents) {
      if (this.loadedComponents[property] === true) {
        notempty = true;
      }
    }
    if (!notempty) {
      this.loadedComponents = null;
    }*/


    
//this is to set the groundwork for having all the 'useful links be dynamically rendered. Right now we are only doing this for excel tools through.
   
    if (this.configService.configData.usefulLinks) {
      this.configService.configData.usefulLinks.forEach (link => {
        if (link.title === 'GSRSFind Excel tools') {
          this.excelCard = link;
        }
      });
    }

    let notempty = false;
    if (this.loadedComponents) {
      if (this.loadedComponents.applications) {
        notempty = true;
      } else if (this.loadedComponents.clinicaltrials) {
        notempty = true;
      } else if (this.loadedComponents.adverseevents) {
        notempty = true;
      } else if (this.loadedComponents.impurities) {
        notempty = true;
      } else if (this.loadedComponents.products) {
        notempty = true;
      }

      if (!notempty) {
        this.loadedComponents = null;
      }
    }

    this.imageLoc = `${this.environment.baseHref || ''}assets/images/home/`;


    this.authService.hasAnyRolesAsync('DataEntry', 'SuperDataEntry', 'Admin').subscribe(response => {
      this.isAuthenticated = response;
    });
    this.gaService.sendPageView(`Home`);
    this.baseDomain = this.configService.configData.apiUrlDomain;
    this.customLinks = this.configService.configData.homeDynamicLinks || [];
    this.customLinks.forEach (link => {
      link.total = 0;
      const searchStr = `${link.facetName}:${link.facetValue}`;
      this.substanceService.searchSingleFacetSimpleCount(link.facetName, link.facetValue).pipe(take(1)).subscribe( response => {
        if (response){
        link.total = Number(response.total);
        } else {
          link.total = 0;
        }
      });
    });
    this.substanceService.getRecordCount().subscribe( response => {
      this.total = response;
    });
   // this.isClosedWelcomeMessage = localStorage.getItem('isClosedWelcomeMessage') === 'false';
   this.isClosedWelcomeMessage = false;

    this.getAdverseEventShinyConfig();
    this.overlayContainer = this.overlayContainerService.getContainerElement();

  }
ngAfterViewInit(){
  this.processResponsiveness();
  const openSubscription = this.matSideNav.openedStart.subscribe(() => {
    this.utilsService.handleMatSidenavOpen(1100);
  });
  const closeSubscription = this.matSideNav.closedStart.subscribe(() => {
    this.utilsService.handleMatSidenavClose();
  });

}

@HostListener('window:resize', ['$event'])
onResize() {
  this.processResponsiveness();
}

private processResponsiveness = () => {
  setTimeout(() => {
    if (window) {
      if (window.innerWidth < 1100) {
        this.matSideNav.close();
        this.isCollapsed = true;
        this.hasBackdrop = true;
      } else {
        this.matSideNav.open();
        this.hasBackdrop = false;
      }
    }
  });
}
  openSideNav() {
    this.gaService.sendEvent('substancesFiltering', 'button:sidenav', 'open');
    this.matSideNav.open();
  }

  routeToCustom(link) {
    const navigationExtras: NavigationExtras = {
      queryParams: { 'facets': link.facetName + '*' + link.facetValue + '.true' }
    };
    this.router.navigate(['/browse-substance'], navigationExtras);
  }

  closeWelcomeMessage(): void {
    this.isClosedWelcomeMessage = true;
    localStorage.setItem('isClosedWelcomeMessage', this.isClosedWelcomeMessage.toString());
  }

  browseSubstances(): void {
    this.router.navigate(['/browse-substance']);
  }

  openModal(templateRef) {

    const dialogRef = this.dialog.open(templateRef, {
      height: '200px',
      width: '400px'
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(result => {
      this.overlayContainer.style.zIndex = null;
    });
  }


  increaseMenuZindex(): void {
    this.overlayContainer.style.zIndex = '1001';
  }

  removeZindex(): void {
    this.overlayContainer.style.zIndex = null;
  }

  processSubstanceSearch(searchValue: string) {
    this.navigateToSearchResults(searchValue);
  }

  navigateToSearchResults(searchTerm: string) {

    const navigationExtras: NavigationExtras = {
      queryParams: searchTerm ? { 'search': searchTerm } : null
    };

    this.router.navigate(['/browse-substance'], navigationExtras);
  }

  getAdverseEventShinyConfig(): void {
    if (this.configService.configData) {
      if (this.configService.configData.adverseEventShinyHomepageDisplay && this.configService.configData.adverseEventShinyHomepageDisplay !== null) {
        this.adverseEventShinyHomepageDisplay = JSON.parse(this.configService.configData.adverseEventShinyHomepageDisplay);
      }
      if (this.configService.configData.adverseEventShinyHomepageURL && this.configService.configData.adverseEventShinyHomepageURL !== null) {
        this.adverseEventShinyHomepageURL = this.configService.configData.adverseEventShinyHomepageURL;
      }
    }
  }

}
