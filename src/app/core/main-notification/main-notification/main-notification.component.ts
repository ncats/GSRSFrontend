import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NgClass } from "@angular/common";
import { MainNotificationService } from "../main-notification.service";
import { AppNotification, NotificationType } from "../notification.model";
import { ConfigService } from "@gsrs-core/config/config.service";

@Component({
  selector: "app-main-notification",
  imports: [NgClass],
  templateUrl: "./main-notification.component.html",
  styleUrl: "./main-notification.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainNotificationComponent {
  private notificationService = inject(MainNotificationService);
  private configService = inject(ConfigService);
  private destroyRef = inject(DestroyRef);

  private isVisible = signal(false);
  private notificationType = signal<NotificationType>(NotificationType.default);
  notificationMessage = signal("");

  private showTopBanner = this.configService.configData.showTopBanner === true;

  protected readonly classes = computed(() => ({
    hidden: !this.isVisible(),
    showing: this.isVisible(),
    'with-top-banner': this.showTopBanner,
    default: this.notificationType() === NotificationType.default,
    success: this.notificationType() === NotificationType.success,
    error: this.notificationType() === NotificationType.error,
  }));

  private notificationTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.notificationService.notificationEvent
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((notification) => this.setNotification(notification));

    this.destroyRef.onDestroy(() => {
      if (this.notificationTimer !== null) clearTimeout(this.notificationTimer);
    });
  }

  // If notification.milisecondsToShow === 0, the notification is permanent (until closed by user)
  setNotification(notification: AppNotification): void {
    this.notificationType.set(notification.type ?? NotificationType.default);
    this.notificationMessage.set(notification.message);
    this.isVisible.set(true);

    if (notification.milisecondsToShow === 0) {
      if (this.notificationTimer !== null) {
        clearTimeout(this.notificationTimer);
        this.notificationTimer = null;
      }
    } else {
      const timeout = notification.milisecondsToShow ?? 5000;
      if (this.notificationTimer !== null) clearTimeout(this.notificationTimer);
      this.notificationTimer = setTimeout(() => {
        this.removeNotification();
        this.notificationTimer = null;
      }, timeout);
    }
  }

  removeNotification(): void {
    if (this.notificationTimer !== null) {
      clearTimeout(this.notificationTimer);
      this.notificationTimer = null;
    }
    this.isVisible.set(false);
  }
}
