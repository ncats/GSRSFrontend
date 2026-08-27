import { ChangeDetectionStrategy, Component, effect, inject, input, signal, ViewEncapsulation } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { OverlayContainer } from "@angular/cdk/overlay";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { AuthService } from "@gsrs-core/auth";
import { ConfigService } from "@gsrs-core/config";
import { LoadingService } from "@gsrs-core/loading";
import { UserProfileComponent } from "@gsrs-core/auth/user-profile/user-profile.component";
import { UserQueryListDialogComponent } from "@gsrs-core/bulk-search/user-query-list-dialog/user-query-list-dialog.component";
import { SubstanceDraftsComponent } from "@gsrs-core/substance-form/substance-drafts/substance-drafts.component";
import { SlicePipe } from "@angular/common";
import { filter, map, startWith, take } from "rxjs";

@Component({
  selector: "app-user-menu",
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    RouterLink,
    SlicePipe,
  ],
  templateUrl: "./user-menu.component.html",
  styleUrl: "./user-menu.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class UserMenuComponent {
  private authService = inject(AuthService);
  private configService = inject(ConfigService);
  private dialog = inject(MatDialog);
  private overlayContainerService = inject(OverlayContainer);
  private loadingService = inject(LoadingService);
  private router = inject(Router);
  private overlayContainer = this.overlayContainerService.getContainerElement();

  showRegistrars = input<boolean>();
  auth = toSignal(this.authService.getAuth());
  showLoginButton = this.configService.configData.showLoginButton !== false;

  canConfigureSystem = signal(false);
  canUserImportData = signal(false);
  canManageCVs = signal(false);
  canRegister = signal(false);

  isLoginPage = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url.startsWith("/login")),
      startWith(this.router.url.startsWith("/login")),
    ),
  );

  constructor() {
    effect(() => {
      const auth = this.auth();
      if (auth) {
        this.updatePrivileges();
      } else {
        this.canConfigureSystem.set(false);
        this.canUserImportData.set(false);
        this.canRegister.set(false);
        this.canManageCVs.set(false);
      }
    });
  }

  increaseMenuZindex(): void {
    this.overlayContainer.style.zIndex = "1001";
  }

  removeZindex(): void {
    this.overlayContainer.style.removeProperty("z-index");
  }

  routeToLogin(): void {
    this.router.navigate(["/login"], { queryParams: { path: this.router.url } });
  }

  openProfile(): void {
    const dialogRef = this.dialog.open(UserProfileComponent, { data: {}, width: "800px" });
    this.overlayContainer.style.zIndex = "1002";
    dialogRef.afterClosed().pipe(take(1)).subscribe(() => {
      this.overlayContainer.style.removeProperty("z-index");
    });
  }

  viewLists(): void {
    const dialogRef = this.dialog.open(UserQueryListDialogComponent, {
      width: "850px",
      autoFocus: false,
      data: { view: "all" },
    });
    this.overlayContainer.style.zIndex = "1002";
    dialogRef.afterClosed().pipe(take(1)).subscribe(() => {
      this.overlayContainer.style.removeProperty("z-index");
    });
  }

  viewDrafts(): void {
    const dialogRef = this.dialog.open(SubstanceDraftsComponent, {
      maxHeight: "85%",
      width: "70%",
      data: { view: "user" },
    });
    this.overlayContainer.style.zIndex = "1002";

    dialogRef.afterClosed().pipe(take(1)).subscribe((response) => {
      this.overlayContainer.style.removeProperty("z-index");
      if (response) {
        this.loadingService.setLoading(true);
        if (response.uuid && response.uuid !== "register") {
          this.router.navigateByUrl(
            `/substances/${response.uuid}/edit?action=import&source=draft`,
            { state: { record: response.substance } },
          );
        } else {
          setTimeout(() => {
            this.router.navigateByUrl(
              `/substances/register/${response.substance.substanceClass}?action=import`,
              { state: { record: response.substance } },
            );
          }, 500);
        }
      }
    });
  }

  logout(): void {
    this.authService.logout();
    setTimeout(() => {
      if (this.configService.configData?.logoutRedirectUrl) {
        window.location.href = this.configService.configData.logoutRedirectUrl;
      } else {
        this.router.navigate(["/home"]);
      }
    }, 1200);
  }

  private async updatePrivileges(): Promise<void> {
    try {
      this.canConfigureSystem.set(await this.authService.hasSpecificPrivilege("Configure System"));
      this.canUserImportData.set(await this.authService.hasSpecificPrivilege("Import Data"));
      this.canRegister.set(await this.authService.canEditData());
      this.canManageCVs.set(await this.authService.hasSpecificPrivilege("Manage CVs"));
    } catch {
      this.canConfigureSystem.set(false);
      this.canUserImportData.set(false);
      this.canRegister.set(false);
      this.canManageCVs.set(false);
    }
  }
}
