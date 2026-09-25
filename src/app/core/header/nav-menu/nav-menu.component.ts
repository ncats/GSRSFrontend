import { ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation } from "@angular/core";
import { OverlayContainer } from "@angular/cdk/overlay";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { Router, RouterLink } from "@angular/router";
import { ConfigService } from "@gsrs-core/config";
import { NavItem } from "../../config/config.model";
import { SubstanceEditImportDialogComponent } from "@gsrs-core/substance-edit-import-dialog/substance-edit-import-dialog.component";
import { sprintf } from "sprintf-js";
import { take } from "rxjs/operators";

@Component({
  selector: "app-nav-menu",
  imports: [MatButtonModule, MatIconModule, MatMenuModule, RouterLink],
  templateUrl: "./nav-menu.component.html",
  styleUrl: "./nav-menu.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NavMenuComponent {
  private configService = inject(ConfigService);
  private overlayContainerService = inject(OverlayContainer);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private overlayContainer = this.overlayContainerService.getContainerElement();

  navItems = input<NavItem[]>([]);
  canRegister = input<boolean>(false);
  canConfigureSystem = input<boolean>(false);

  private contactEmail = this.configService.configData.contactEmail || "";
  private contactEmailAlt = this.configService.configData.contactEmailAlt || "";

  increaseMenuZindex(): void {
    this.overlayContainer.style.zIndex = "1001";
  }

  removeZindex(): void {
    this.overlayContainer.style.removeProperty("z-index");
  }

  transformMailToPath(item: NavItem): string {
    if (item?.kind && item?.mailToPath) {
      let email = "";
      if (item.kind === "contact-us") {
        email = this.contactEmail;
      }
      if (item.kind === "contact-us-alt") {
        email = this.contactEmailAlt;
      }
      const subject = item?.queryParams?.subject || "";
      const part1 = sprintf(item.mailToPath, email);
      return part1 + "?" + (subject ? "subject=" + subject : "");
    }
    return "";
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
}
