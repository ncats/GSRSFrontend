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

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BaseComponent implements OnInit, OnDestroy {
  mainPathSegment = '';
  navItems = [
    {
      display: 'Browse Substances',
      path: 'browse-substance'
    },
    {
      display: 'Structure Search',
      path: 'structure-search'
    },
    {
      display: 'Sequence Search',
      path: 'sequence-search'
    },
    {
      display: 'Register',
      children: [
        {
          display: 'Chemical',
          path: 'substances/register/chemical',
        },
        {
          display: 'Protein',
          path: 'substances/register/protein',
        },
        {
          display: 'Polymer',
          path: 'substances/register/polymer',
        },
        {
          display: 'Nucleic Acid',
          path: 'substances/register/nucleicAcid',
        },
        {
          display: 'Mixture',
          path: 'substances/register/mixture',
        },
        {
          display: 'Structurally Diverse',
          path: 'substances/register/structurallyDiverse',
        },
        {
          display: 'Concept',
          path: 'substances/register/concept',
        },
        {
          display: 'G1 Specified Substance',
          path: 'substances/register/specifiedSubstanceG1',
        }
      ]
    }
  ];
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

  constructor(
    private router: Router,
    public authService: AuthService,
    private configService: ConfigService,
    private activatedRoute: ActivatedRoute,
    private overlayContainerService: OverlayContainer,
    private loadingService: LoadingService,
    private bottomSheet: MatBottomSheet
  ) {
    this.classicLinkPath = '/ginas/app/';
    this.classicLinkQueryParamsString = '';
  }

  ngOnInit() {
    this.baseDomain = this.configService.configData.apiUrlDomain;

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

    if (this.environment.navItems && this.environment.navItems.length) {
      this.navItems = this.navItems.concat(this.environment.navItems);
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
    const basePath = '/ginas/app/';

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

    }

    if (params != null) {
      Object.keys(params).forEach(key => {
        this.classicLinkQueryParams[key] = params[key];
      });
    }

    let queryParamsString = '';
    console.log(this.classicLinkQueryParams);
    Object.keys(this.classicLinkQueryParams).forEach((key, index) => {
      const separator = index && '&' || '?';
      queryParamsString += `${separator}${key}=${this.classicLinkQueryParams[key]}`;
    });
    console.log(queryParamsString);
    this.classicLinkQueryParamsString = queryParamsString;
  }

}
