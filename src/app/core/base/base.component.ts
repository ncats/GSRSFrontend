import { Component, OnInit, ViewEncapsulation, HostListener, OnDestroy } from '@angular/core';
import { Router, RouterEvent, NavigationEnd, NavigationExtras, ActivatedRoute, NavigationStart, ResolveEnd, ParamMap } from '@angular/router';
import { Environment } from '../../../environments/environment.model';
import { AuthService } from '../auth/auth.service';
import { Auth } from '../auth/auth.model';
import { ConfigService } from '../config/config.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { LoadingService } from '../loading/loading.service';
import { HighlightedSearchActionComponent } from '../highlighted-search-action/highlighted-search-action.component';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { navItems } from './nav-items.constant';

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
  private overlayContainer: HTMLElement;
  private bottomSheetOpenTimer: any;
  private bottomSheetRef: MatBottomSheetRef;
  private bottomSheetCloseTimer: any;
  private selectedText: string;
  private subscriptions: Array<Subscription> = [];
  baseDomain: string;
  classicLinkPath: string;
  classicLinkQueryParamsString: string;
  private classicLinkQueryParams = {};
  isAdmin = false;
  contactEmail: string;
  version?: string;
  appId: string;
  clasicBaseHref: string;
  navItems = navItems;

  constructor(
    private router: Router,
    public authService: AuthService,
    private configService: ConfigService,
    private activatedRoute: ActivatedRoute,
    private overlayContainerService: OverlayContainer,
    private loadingService: LoadingService,
    private bottomSheet: MatBottomSheet
  ) {
    this.classicLinkPath = this.configService.environment.clasicBaseHref;
    this.classicLinkQueryParamsString = '';
    this.contactEmail = this.configService.configData.contactEmail;
    this.clasicBaseHref = this.configService.environment.clasicBaseHref;
  }

  ngOnInit() {

    const roleSubscription = this.authService.hasRolesAsync('Admin').subscribe(response => {
      this.isAdmin = response;
    });
    this.subscriptions.push(roleSubscription);

    this.baseDomain = this.configService.configData.apiUrlDomain;
    this.version = this.configService.configData.version || '';

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

    const authSubscription = this.authService.getAuth().subscribe(auth => {
      this.auth = auth;
    });
    this.subscriptions.push(authSubscription);

    this.environment = this.configService.environment;
    this.appId = this.environment.appId;

    if (this.configService.configData.navItems && this.configService.configData.navItems.length) {

      const filteredNavItems = this.configService.configData.navItems.filter(navItem => {
        if (navItem.children != null && navItem.children.length > 0) {
          let isNotExisting = true;
          for (let i = 0; i < this.navItems.length; i++) {
            if (this.navItems[i].display === navItem.display && this.navItems[i].children != null) {
              this.navItems[i].children = this.navItems[i].children.concat(navItem.children);
              this.navItems[i].children.sort((a, b) => {
                return a.order - b.order;
              });
              isNotExisting = false;
              break;
            }
          }
          return isNotExisting;
        } else {
          return true;
        }
      });

      this.navItems = this.navItems.concat(filteredNavItems);
      this.navItems.sort((a, b) => {
        return a.order - b.order;
      });
    }

    this.logoSrcPath = `${this.environment.baseHref || '/'}assets/images/gsrs-logo.svg`;

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
      queryParams: searchTerm ? { 'search': searchTerm } : null
    };

    this.router.navigate(['/browse-substance'], navigationExtras);
  }

  increaseMenuZindex(): void {
    this.overlayContainer.style.zIndex = '1001';
  }

  removeZindex(): void {
    this.overlayContainer.style.zIndex = null;
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
      '/substances/register': 'wizard'
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

}
