import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ConfigService } from '../../config/config.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AuthService } from '../../auth/auth.service';
import { SubstanceTextSearchService } from '@gsrs-core/substance-text-search/substance-text-search.service';
import { Auth } from '../../auth/auth.model';
import { Subscription } from 'rxjs';
import { NavItem } from '@gsrs-core/config';

@Component({
  selector: 'app-pfda-toolbar',
  templateUrl: './pfda-toolbar.component.html',
  styleUrls: ['./pfda-toolbar.component.scss']
})
export class PfdaToolbarComponent implements OnInit {
  pfdaBaseUrl: string;
  logoSrcPath: string;
  homeIconPath: string;
  auth?: Auth;
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
    public authService: AuthService
  ) {
    const authSubscription = this.authService.getAuth().subscribe(auth => {
      this.auth = auth;
    });
    this.subscriptions.push(authSubscription);
  }

  ngOnInit() {
    this.pfdaBaseUrl = this.configService.configData.pfdaBaseUrl || '/';

    const baseHref = this.configService.environment.baseHref || '/'
    this.logoSrcPath = `${baseHref}assets/images/pfda/pfda-logo.png`;
    this.homeIconPath = `${baseHref}assets/images/pfda/home.svg`;

    this.overlayContainer = this.overlayContainerService.getContainerElement();

    if (this.activatedRoute.snapshot.queryParamMap.has('search')) {
      this.searchValue = this.activatedRoute.snapshot.queryParamMap.get('search');
    }

    const paramsSubscription = this.activatedRoute.queryParamMap.subscribe(params => {
      this.searchValue = params.get('search');
    });
    this.subscriptions.push(paramsSubscription);

    this.substanceTextSearchService.registerSearchComponent('main-substance-search');
    const cleanSearchSubscription = this.substanceTextSearchService.setSearchComponentValueEvent('main-substance-search')
    .subscribe(value => {
      this.searchValue = value;
    });
    this.subscriptions.push(cleanSearchSubscription);

    // Items for header menu "Register new substance"
    // Specified in file nav-items.constant.ts and additional substances may be specified in the config.json file
    const regNavItem = this.configService.configData.navItems.find((nI) => nI.display === 'Register');
    this.registerItems = regNavItem === undefined || regNavItem.children === undefined ? [] : regNavItem.children;
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
}
