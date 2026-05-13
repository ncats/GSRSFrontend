import { BreakpointObserver } from "@angular/cdk/layout";
import { OverlayContainer } from "@angular/cdk/overlay";
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { RouterLink } from "@angular/router";
import { ConfigService } from "@gsrs-core/config";
import { map } from "rxjs";

@Component({
  selector: "app-browse-other-menu",
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule, RouterLink],
  templateUrl: "./browse-other-menu.component.html",
  styleUrl: "./browse-other-menu.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BrowseOtherMenuComponent {
  private configService = inject(ConfigService);
  private overlayContainerService = inject(OverlayContainer);
  private breakpointObserver = inject(BreakpointObserver);
  private overlayContainer = this.overlayContainerService.getContainerElement();

  loadedComponents = this.configService.configData.loadedComponents || null;
  adverseEventShinyHomepageDisplay = this.configService.configData.adverseEventShinyHomepageDisplay === 'true';
  adverseEventShinyHomepageURL = this.configService.configData.adverseEventShinyHomepageURL;

  showBrowseOther = toSignal(
    this.breakpointObserver.observe("(min-width: 1501px)").pipe(map((r) => r.matches)),
    { initialValue: true },
  );

  increaseMenuZindex(): void {
    this.overlayContainer.style.zIndex = "1001";
  }

  removeZindex(): void {
    this.overlayContainer.style.removeProperty("z-index");
  }
}
