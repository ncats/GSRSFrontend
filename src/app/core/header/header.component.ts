import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { BreakpointObserver } from "@angular/cdk/layout";
import { OverlayContainer } from "@angular/cdk/overlay";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthService } from "@gsrs-core/auth";
import { ConfigService } from "@gsrs-core/config";
import { NavItem } from "../config/config.model";
import { SubstanceEditImportDialogComponent } from "@gsrs-core/substance-edit-import-dialog/substance-edit-import-dialog.component";
import { SubstanceTextSearchModule } from "@gsrs-core/substance-text-search/substance-text-search.module";
import { SubstanceTextSearchService } from "@gsrs-core/substance-text-search/substance-text-search.service";
import { UtilsService } from "@gsrs-core/utils";
import { WildcardService } from "@gsrs-core/utils/wildcard.service";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";
import { BrowseOtherMenuComponent } from "./browse-other-menu/browse-other-menu.component";
import { UserMenuComponent } from "./user-menu/user-menu.component";
import { map, Subscription, take } from "rxjs";
import moment from "moment";

@Component({
  selector: "app-header",
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    RouterLink,
    SubstanceTextSearchModule,
    NavMenuComponent,
    BrowseOtherMenuComponent,
    UserMenuComponent,
  ],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit, OnDestroy {
  private configService = inject(ConfigService);
  private authService = inject(AuthService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private overlayContainerService = inject(OverlayContainer);
  private breakpointObserver = inject(BreakpointObserver);
  private utilsService = inject(UtilsService);
  private substanceTextSearchService = inject(SubstanceTextSearchService);
  private wildcardService = inject(WildcardService);
  private dialog = inject(MatDialog);
  private overlayContainer = this.overlayContainerService.getContainerElement();
  private subscriptions: Subscription[] = [];

  auth = toSignal(this.authService.getAuth(), { initialValue: null });
  showRegistrars = toSignal(
    this.breakpointObserver.observe("(min-width: 1611px)").pipe(map((r) => r.matches)),
    { initialValue: true },
  );
  canRegister = signal(false);
  canConfigureSystem = signal(false);
  navItems = signal<NavItem[]>([]);

  logoSrcPath = "";
  showHeaderBar = "true";
  customToolbarComponent = this.configService.configData.customToolbarComponent || "";
  version = signal("");
  versionTooltipMessage = signal("");
  registerNav = signal<NavItem[]>([]);
  searchNav = signal<NavItem[]>([]);
  searchValue = signal("");

  constructor() {
    effect(() => {
      const auth = this.auth();
      if (auth) {
        this.updatePrivileges();
      } else {
        this.canRegister.set(false);
        this.canConfigureSystem.set(false);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    const env = this.configService.environment;
    this.logoSrcPath = `${env.baseHref || ""}assets/images/gsrs-logo.svg`;
    this.showHeaderBar = this.activatedRoute.snapshot.queryParams["header"] || "true";

    this.utilsService
      .getBuildInfo()
      .pipe(take(1))
      .subscribe((buildInfo) => {
        const v = this.configService.configData.version || buildInfo.version;
        this.version.set(v);
        this.versionTooltipMessage.set(`V${v} built on ${moment(new Date(buildInfo.buildTime)).utc().format("ddd MMM D YYYY HH:mm:ss z")}`);
      });

    const rawNavItems: NavItem[] = this.configService.configData.navItems || [];
    const loaded = this.configService.configData.loadedComponents;
    const filtered = [...rawNavItems];

    if (loaded && Object.values(loaded).some((v) => v)) {
      const loadedMap = loaded as Record<string, boolean>;
      for (let i = filtered.length - 1; i >= 0; i--) {
        const children = filtered[i].children;
        if (children) {
          for (let j = children.length - 1; j >= 0; j--) {
            const comp = children[j].component;
            if (comp && !loadedMap[comp]) {
              children.splice(j, 1);
            }
          }
        }
        const comp = filtered[i].component;
        if (comp && !loadedMap[comp]) {
          filtered.splice(i, 1);
        }
      }
    }

    const okToRegister = await this.authService.canEditData();
    filtered.forEach((item) => {
      if (item.display === "Register" && okToRegister) {
        this.registerNav.set(item.children || []);
      }
      if (item.display === "Search") {
        this.searchNav.set(item.children || []);
      }
    });
    this.navItems.set(filtered);

    if (this.activatedRoute.snapshot.queryParamMap.has("search")) {
      this.searchValue.set(this.activatedRoute.snapshot.queryParamMap.get("search") ?? "");
    }
    this.subscriptions.push(
      this.activatedRoute.queryParamMap.subscribe((params) => {
        this.searchValue.set(params.get("search") ?? "");
      }),
    );

    this.substanceTextSearchService.registerSearchComponent("main-substance-search");
    this.subscriptions.push(
      this.substanceTextSearchService
        .setSearchComponentValueEvent("main-substance-search")
        .subscribe((value) => {
          this.searchValue.set(value);
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  processSubstanceSearch(searchValue: string): void {
    this.wildcardService.getTopSearchBoxText(searchValue);
    this.router.navigate(["/browse-substance"], {
      queryParams: searchValue ? { search: searchValue } : null,
    });
  }

  increaseMenuZindex(): void {
    this.overlayContainer.style.zIndex = "1001";
  }

  removeZindex(): void {
    this.overlayContainer.style.removeProperty("z-index");
  }

  importDialog(): void {
    const dialogRef = this.dialog.open(SubstanceEditImportDialogComponent, {
      width: "650px",
      autoFocus: false,
    });
    this.overlayContainer.style.zIndex = "1002";
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((response) => {
        if (response) {
          this.overlayContainer.style.removeProperty("z-index");
          this.router.navigateByUrl("/substances/register?action=import", {
            state: { record: response },
          });
        }
      });
  }

  private async updatePrivileges(): Promise<void> {
    try {
      this.canRegister.set(await this.authService.canEditData());
      this.canConfigureSystem.set(
        await this.authService.hasSpecificPrivilege("Configure System"),
      );
    } catch {
      this.canRegister.set(false);
      this.canConfigureSystem.set(false);
    }
  }
}
