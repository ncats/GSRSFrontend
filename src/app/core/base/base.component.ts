import { Component, OnInit, OnDestroy, ViewEncapsulation } from "@angular/core";
import { Router, Event, NavigationStart } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { ConfigService } from "../config/config.service";
import { LoadingService } from "../loading/loading.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-base",
  templateUrl: "./base.component.html",
  styleUrl: "./base.component.scss",
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class BaseComponent implements OnInit, OnDestroy {
  isPfdaVersion: boolean;
  showTopBanner: boolean;
  showFooter: boolean;

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private configService: ConfigService,
    private loadingService: LoadingService,
  ) {
    this.isPfdaVersion = this.configService.configData.isPfdaVersion === true;
    this.showTopBanner = this.configService.configData.showTopBanner === true;
    this.showFooter = this.configService.configData.showFooter === true;
  }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    const routerSub = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.loadingService.resetLoading();
      }
    });
    this.subscriptions.push(routerSub);

    const authSub = this.authService.checkAuth().subscribe({
      error: (error) => {
        if (
          error.status === 403 &&
          this.router.url.split("?")[0] !== "/login" &&
          this.router.url.split("?")[0] !== "/unauthorized"
        ) {
          this.loadingService.setLoading(false);
          this.router.navigate(["/unauthorized"]);
        }
      },
    });
    this.subscriptions.push(authSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
