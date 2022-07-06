import { Component, OnInit, ViewEncapsulation, HostListener, OnDestroy } from '@angular/core';
import { Router, RouterEvent, NavigationExtras, ActivatedRoute, NavigationStart, ResolveEnd, ParamMap } from '@angular/router';
import { Environment } from '../../../environments/environment.model';
import { AuthService } from '../auth/auth.service';
import { Auth } from '../auth/auth.model';
import { ConfigService } from '../config/config.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { LoadingService } from '../loading/loading.service';
import { HighlightedSearchActionComponent } from '../highlighted-search-action/highlighted-search-action.component';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Observable, Subscription } from 'rxjs';
import { UserProfileComponent } from '@gsrs-core/auth/user-profile/user-profile.component';
import { SubstanceTextSearchService } from '@gsrs-core/substance-text-search/substance-text-search.service';
import { NavItem, LoadedComponents } from '../config/config.model';
import { UtilsService } from '@gsrs-core/utils';
import { take } from 'rxjs/operators';
import * as moment from 'moment';
import { SubstanceEditImportDialogComponent } from '@gsrs-core/substance-edit-import-dialog/substance-edit-import-dialog.component';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BaseComponent implements OnInit, OnDestroy {
  mainPathSegment = '';
  logoSrcPath: string;
  auth?: Auth;
  environment: Environment;
  searchValue: string;
  baseDomain: string;
  classicLinkPath: string;
  classicLinkQueryParamsString: string;
  isAdmin = false;
  contactEmail: string;
  version?: string;
  versionTooltipMessage = '';
  appId: string;
  clasicBaseHref: string;
  navItems: Array<NavItem>;
  canRegister = false;
  registerNav: Array<NavItem>;
  adverseEventShinyHomepageDisplay = false;
  loadedComponents: LoadedComponents;
  private overlayContainer: HTMLElement;
  private bottomSheetOpenTimer: any;
  private bottomSheetRef: MatBottomSheetRef;
  private bottomSheetCloseTimer: any;
  private selectedText: string;
  private subscriptions: Array<Subscription> = [];
  private classicLinkQueryParams = {};
  showHeaderBar = 'true';

  constructor(
    private router: Router,
    public authService: AuthService,
    private configService: ConfigService,
    private activatedRoute: ActivatedRoute,
    private overlayContainerService: OverlayContainer,
    private loadingService: LoadingService,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private substanceTextSearchService: SubstanceTextSearchService,
    private utilsService: UtilsService,
  ) {
    this.classicLinkPath = this.configService.environment.clasicBaseHref;
    this.classicLinkQueryParamsString = '';
    this.contactEmail = this.configService.configData.contactEmail;
    this.clasicBaseHref = this.configService.environment.clasicBaseHref;
    this.navItems = this.configService.configData.navItems;
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:keyup', ['$event'])
  // @HostListener('document:selectionchange', ['$event'])
  onKeyUp(event: Event) {
    let text = '';
    let selection: Selection;
    let range: Range;
    let selectionStart: number;
    let selectionEnd: number;
    const activeEl: HTMLInputElement = document.activeElement as HTMLInputElement;

    if (activeEl != null) {
      const activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
      if (
        (activeElTagName === 'textarea') || (activeElTagName === 'input' &&
          /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
        (typeof activeEl.selectionStart === 'number')
      ) {
        selectionStart = activeEl.selectionStart;
        selectionEnd = activeEl.selectionEnd;
        text = activeEl.value.slice(selectionStart, selectionEnd);
      } else if (window.getSelection) {
        selection = window.getSelection();
        // ###### why just chrome?
        if (selection.rangeCount > 0) {
          range = selection.getRangeAt(0);
        }
        text = selection.toString();
      }

      clearTimeout(this.bottomSheetOpenTimer);

      if (text && text !== this.selectedText) {
        this.selectedText = text;
       /* this.bottomSheetOpenTimer = setTimeout(() => {
          const subscription = this.openSearchBottomSheet(text).subscribe(() => {
            setTimeout(() => {
              if (selection != null && range != null) {
                selection.removeAllRanges();
                selection.addRange(range);
              } else if (selectionStart != null) {
                activeEl.focus();
                activeEl.selectionStart = selectionStart;
                activeEl.selectionEnd = selectionEnd;
              }
            });
            subscription.unsubscribe();
          }, () => {
            subscription.unsubscribe();
          }, () => {
            this.selectedText = '';
            subscription.unsubscribe();
          });
        }, 600);*/
      }
    }
  }

  ngOnInit() {
    this.showHeaderBar = this.activatedRoute.snapshot.queryParams['header'] || 'true';
    this.loadedComponents = this.configService.configData.loadedComponents || null;

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
    const roleSubscription = this.authService.hasRolesAsync('Admin').subscribe(response => {
      this.isAdmin = response;
    });
    this.subscriptions.push(roleSubscription);

    const regSubscription =
    this.authService.hasAnyRolesAsync('Admin', 'Updater', 'SuperUpdater', 'DataEntry', 'SuperDataEntry').subscribe(response => {
      this.canRegister = response;
    });
    this.subscriptions.push(regSubscription);
    this.baseDomain = this.configService.configData.apiUrlDomain;

    this.utilsService.getBuildInfo().pipe(take(1)).subscribe(buildInfo => {
      this.version = this.configService.configData.version || buildInfo.version;
      this.versionTooltipMessage = `V${this.version}`;
      this.versionTooltipMessage += ` built on ${moment(buildInfo.buildTime).utc().format('ddd MMM D YYYY HH:mm:SS z')}`;
    });
    this.navItems.forEach(item => {
      if (item.display === 'Register') {
        this.registerNav = item.children;
      }
    });
    if (this.loadedComponents) {
      for(let i = this.navItems.length - 1; i >= 0; i--) {
        if (this.navItems[i].children) {
        for (let j = this.navItems[i].children.length - 1; j >= 0; j--) {
          if (this.navItems[i].children[j].component) {
            if (!this.loadedComponents[this.navItems[i].children[j].component]) {
              this.navItems[i].children.splice(j, 1);
          }
        }

        }
    }
    if (this.navItems[i].component) {
      if (!this.loadedComponents[this.navItems[i].component]) {
        this.navItems.splice(i, 1);

    }
  }
  }
}
    this.overlayContainer = this.overlayContainerService.getContainerElement();

    let urlPath = this.router.routerState.snapshot.url.split('?')[0];
    this.setClassicLinkPath(urlPath.substring(1));

    if (this.activatedRoute.snapshot.queryParamMap.has('search')) {
      this.searchValue = this.activatedRoute.snapshot.queryParamMap.get('search');
      this.setClassicLinkQueryParams(this.activatedRoute.snapshot.queryParamMap);
    }

    const paramsSubscription = this.activatedRoute.queryParamMap.subscribe(params => {
      this.searchValue = params.get('search');
      this.setClassicLinkQueryParams(params);
    });
    this.subscriptions.push(paramsSubscription);

    const authSubscription2 = this.authService.checkAuth().subscribe(auth => {
    }, error => {
      if (error.status === 403 && (this.router.url.split('?')[0] !== '/login' && this.router.url.split('?')[0] !== '/unauthorized')) {
        this.loadingService.setLoading(false);
        this.router.navigate(['/unauthorized']);
      }
    });
      this.subscriptions.push(authSubscription2);

    const authSubscription = this.authService.getAuth().subscribe(auth => {
      this.auth = auth;
    }, error => {
    });

    this.subscriptions.push(authSubscription);

    this.environment = this.configService.environment;
    this.appId = this.environment.appId;

    this.logoSrcPath = `${this.environment.baseHref || ''}assets/images/gsrs-logo.svg`;

    const routerSubscription = this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof ResolveEnd) {
        this.mainPathSegment = this.getMainPathSegmentFromUrl(event.url.substring(1));
        urlPath = event.url.split('?')[0];
        this.setClassicLinkPath(urlPath.substring(1));
      }

      if (event instanceof NavigationStart) {
        this.classicLinkQueryParams = {};
        this.loadingService.resetLoading();
      }
    });
    this.subscriptions.push(routerSubscription);

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.mainPathSegment = this.getMainPathSegmentFromUrl(this.router.routerState.snapshot.url.substring(1));

    this.substanceTextSearchService.registerSearchComponent('main-substance-search');
    const cleanSearchSubscription = this.substanceTextSearchService.setSearchComponentValueEvent('main-substance-search')
    .subscribe(value => {
      this.searchValue = value;
    });
    this.subscriptions.push(cleanSearchSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    clearTimeout(this.bottomSheetOpenTimer);
    clearTimeout(this.bottomSheetCloseTimer);
  }

  getMainPathSegmentFromUrl(url: string): string {
    const path = url.split('?')[0];
    const mainPathPart = path.split('/')[0];
    return mainPathPart;
  }

  routeToLogin(): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        path: this.router.url
      }
    };

    this.router.navigate(['/login'], navigationExtras);
  }

  processSubstanceSearch(searchValue: string) {
    this.navigateToSearchResults(searchValue);
  }

  navigateToSearchResults(searchTerm: string) {

    const navigationExtras: NavigationExtras = {
      queryParams: searchTerm ? { search: searchTerm } : null
    };

    this.router.navigate(['/browse-substance'], navigationExtras);
  }

  increaseMenuZindex(): void {
    this.overlayContainer.style.zIndex = '1001';
  }

  removeZindex(): void {
    this.overlayContainer.style.zIndex = null;
  }

  openSearchBottomSheet(searchTerm: string): Observable<void> {

    return new Observable(observer => {

      if (searchTerm) {

        clearTimeout(this.bottomSheetCloseTimer);

        if (this.bottomSheetRef != null) {
          this.bottomSheetRef.dismiss();
          this.bottomSheetRef = null;
        }

        this.bottomSheetRef = this.bottomSheet.open(HighlightedSearchActionComponent, {
          data: { searchTerm: searchTerm },
          hasBackdrop: false,
          closeOnNavigation: true
        });

        const openedSubscription = this.bottomSheetRef.afterOpened().subscribe(() => {
          observer.next();
          openedSubscription.unsubscribe();
        });
        this.bottomSheetCloseTimer = setTimeout(() => {
          if (this.bottomSheetRef != null) {
            this.bottomSheetRef.dismiss();
            this.bottomSheetRef = null;
            observer.complete();
          }
        }, 5000);
        const dismissedSubscription = this.bottomSheetRef.afterDismissed().subscribe(() => {
          clearTimeout(this.bottomSheetCloseTimer);
          this.bottomSheetRef = null;
          observer.complete();
          dismissedSubscription.unsubscribe();
        });
      } else {
        observer.error();
        observer.complete();
      }
    });
  }

  setClassicLinkPath(path: string): void {
    const basePath = this.clasicBaseHref;

    const pathDictionary = {
      '/home': '',
      '/browse-substance': 'substances',
      '/structure-search': 'structure',
      '/sequence-search': 'sequence',
      '/substances/register': 'wizard',
      '/admin': 'admin'
    };

    const pathParts = path.split('/');

    let pathKey = '';
    pathParts.forEach((part, index) => {
      if (index < 2) {
        pathKey += `/${part}`;
      } else {
        this.setClassicLinkQueryParams(null, { kind: part });
      }
    });
    this.classicLinkPath = `${basePath}${pathDictionary[pathKey] || ''}`;
  }

  setClassicLinkQueryParams(paramMap?: ParamMap, params?: { [queryParam: string]: string }): void {

    if (paramMap != null) {
      const paramsDict = {};
      paramsDict['q'] = paramMap.get('search')
        || paramMap.get('structure_search')
        || paramMap.get('sequence_search')
        || paramMap.get('structure');

      if (paramMap.get('sequence_search')) {
        paramsDict['type'] = 'sequence';
        paramsDict['identity'] = paramMap.get('cutoff');
        paramsDict['identityType'] = paramMap.get('type');
      } else if (paramMap.get('structure_search') || paramMap.get('structure')) {
        paramsDict['cutoff'] = paramMap.get('cutoff');
        paramsDict['type'] = paramMap.get('type');
      }

      paramsDict['id'] = paramMap.get('sequence');
      paramsDict['seqType'] = paramMap.get('seq_type');

      Object.keys(paramsDict).forEach(key => {
        if (paramsDict[key] != null) {
          this.classicLinkQueryParams[key] = paramsDict[key];
        }
      });
    }

    if (params != null) {
      Object.keys(params).forEach(key => {
        this.classicLinkQueryParams[key] = params[key];
      });
    }

    let queryParamsString = '';
    Object.keys(this.classicLinkQueryParams).forEach((key, index) => {
      const separator = index && '&' || '?';
      queryParamsString += `${separator}${key}=${this.classicLinkQueryParams[key]}`;
    });

    this.classicLinkQueryParamsString = queryParamsString;
  }

  openProfile(): void {
    const dialogRef = this.dialog.open(UserProfileComponent, {
      data: {},
      width: '800px'
    });
    this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
      this.overlayContainer.style.zIndex = null;
    });
  }

  importDialog(): void {
    const dialogRef = this.dialog.open(SubstanceEditImportDialogComponent, {
      width: '650px',
      autoFocus: false

    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
      if (response) {
        this.overlayContainer.style.zIndex = null;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigateByUrl('/substances/register?action=import', { state: { record: response } });
      }
    });

  }

  logout() {
    this.authService.logout();
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 1200);
  }

}
