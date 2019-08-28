import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { Router, RouterEvent, NavigationEnd, NavigationExtras, ActivatedRoute, NavigationStart } from '@angular/router';
import { Environment } from '../../../environments/environment.model';
import { AuthService } from '../auth/auth.service';
import { Auth } from '../auth/auth.model';
import { ConfigService } from '../config/config.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { LoadingService } from '../loading/loading.service';
import { HighlightedSearchActionComponent } from '../highlighted-search-action/highlighted-search-action.component';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BaseComponent implements OnInit {
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
          path: 'substances/register'
        }
      ]
    }
  ];
  logoSrcPath: string;
  auth?: Auth;
  environment: Environment;
  searchValue: string;
  private overlayContainer: HTMLElement;
  private bottomSheetTimer: any;
  private bottomSheetRef: MatBottomSheetRef;

  constructor(
    private router: Router,
    public authService: AuthService,
    private configService: ConfigService,
    private activatedRoute: ActivatedRoute,
    private overlayContainerService: OverlayContainer,
    private loadingService: LoadingService,
    private bottomSheet: MatBottomSheet
  ) { }

  ngOnInit() {
    this.overlayContainer = this.overlayContainerService.getContainerElement();

    if (this.activatedRoute.snapshot.queryParamMap.has('search')) {
      this.searchValue = this.activatedRoute.snapshot.queryParamMap.get('search');
    }

    this.activatedRoute.queryParamMap.subscribe(params => {
      this.searchValue = params.get('search');
    });

    this.authService.getAuth().subscribe(auth => {
      this.auth = auth;
    });

    this.environment = this.configService.environment;

    if (this.environment.navItems && this.environment.navItems.length) {
      this.navItems.concat(this.environment.navItems);
    }

    this.logoSrcPath = `${this.environment.baseHref || '/'}assets/images/gsrs-logo.svg`;

    this.router.events.subscribe((event: RouterEvent) => {

      if (event instanceof NavigationEnd) {
        this.mainPathSegment = this.getMainPathSegmentFromUrl(event.url.substring(1));
      }

      if (event instanceof NavigationStart) {
        this.loadingService.resetLoading();
      }
    });

    this.mainPathSegment = this.getMainPathSegmentFromUrl(this.router.routerState.snapshot.url.substring(1));
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
  @HostListener('document:selectionchange', ['$event'])
  onKeyUp(event: Event) {
    let text = '';
    const activeEl: HTMLInputElement = event.target['activeElement'] as HTMLInputElement;
    const activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    if (
      (activeElTagName === 'textarea') || (activeElTagName === 'input' &&
      /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
      (typeof activeEl.selectionStart === 'number')
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
        text = window.getSelection().toString();
    }

    clearTimeout(this.bottomSheetTimer);

    if (text) {
      this.bottomSheetTimer = setTimeout(() => {
        this.openSearchBottomSheet(text);
      }, 800);
    }
  }

  openSearchBottomSheet(searchTerm: string): void {

    if (searchTerm) {
      if (this.bottomSheetRef != null) {
        this.bottomSheetRef.dismiss();
        this.bottomSheetRef = null;
      }

      this.bottomSheetRef = this.bottomSheet.open(HighlightedSearchActionComponent, {
        data: { searchTerm: searchTerm }
      });
    }
  }

}
