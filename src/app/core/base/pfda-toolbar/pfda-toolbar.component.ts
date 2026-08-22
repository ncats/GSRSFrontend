import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ConfigService } from '../../config/config.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AuthService } from '../../auth/auth.service';
import { SubstanceTextSearchService } from '@gsrs-core/substance-text-search/substance-text-search.service';
import { concatMap, Subscription } from 'rxjs';
import { NavItem } from '@gsrs-core/config';

@Component({
    selector: 'app-pfda-toolbar',
    templateUrl: './pfda-toolbar.component.html',
    styleUrls: ['./pfda-toolbar.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PfdaToolbarComponent implements OnInit, OnDestroy {
  pfdaBaseUrl: string;
  supportEmail: string;
  logoSrcPath: string;
  homeIconPath: string;
  searchValue: string;
  registerItems: Array<NavItem>;
  private overlayContainer: HTMLElement;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private configService: ConfigService,
    private overlayContainerService: OverlayContainer,
    private substanceTextSearchService: SubstanceTextSearchService,
    public authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.pfdaBaseUrl = this.configService.configData.pfdaBaseUrl || '/';

    const baseHref = this.configService.environment.baseHref || '/ginas/app/beta/';
    this.logoSrcPath = `${baseHref}assets/images/pfda/pfda-logo.png`;
    this.homeIconPath = `${baseHref}assets/images/pfda/home.svg`;
    this.supportEmail = this.configService.configData.contactEmail || 'fda-srs@fda.hhs.gov';

    this.overlayContainer = this.overlayContainerService.getContainerElement();

    if (this.activatedRoute.snapshot.queryParamMap.has('search')) {
      this.searchValue = this.activatedRoute.snapshot.queryParamMap.get('search');
    }

    const paramsSubscription = this.activatedRoute.queryParamMap.subscribe(params => {
      this.searchValue = params.get('search');
      this.changeDetectorRef.markForCheck();
    });
    this.subscriptions.push(paramsSubscription);

    this.substanceTextSearchService.registerSearchComponent('main-substance-search');
    const cleanSearchSubscription = this.substanceTextSearchService.setSearchComponentValueEvent('main-substance-search')
    .subscribe(value => {
      this.searchValue = value;
      this.changeDetectorRef.markForCheck();
    });
    this.subscriptions.push(cleanSearchSubscription);

    // Items for header menu "Register new substance"
    // Specified in file nav-items.constant.ts and additional substances may be specified in the config.json file
    const regNavItem = this.configService.configData.navItems.find((nI) => nI.display === 'Register');
    this.registerItems = regNavItem === undefined || regNavItem.children === undefined ? [] : regNavItem.children;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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

  login(): void {
    this.authService.pfdaLogin().pipe(
      concatMap(success => {
        return this.authService.getAuth();
      })).subscribe();
  }

  logout(): void {
    this.authService.logout();
  }
}
