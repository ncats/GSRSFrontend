import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { GoogleAnalyticsService } from './google-analytics/google-analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    iconRegistry.addSvgIcon(
      'chevron_right',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-chevron_right-24px.svg'));

    iconRegistry.addSvgIcon(
      'search',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-search-24px.svg'));

    iconRegistry.addSvgIcon(
      'subdirectory_arrow_right',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-subdirectory_arrow_right-24px.svg'));

    iconRegistry.addSvgIcon(
      'list',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-list-24px.svg'));

    iconRegistry.addSvgIcon(
      'view_stream',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-view_stream-24px.svg'));

    iconRegistry.addSvgIcon(
      'menu',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-menu-24px.svg'));

    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-close-24px.svg'));

    iconRegistry.addSvgIcon(
      'delete_forever',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-delete_forever-24px.svg'));

    iconRegistry.addSvgIcon(
      'edit',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-edit-24px.svg'));

    iconRegistry.addSvgIcon(
      'zoom_in',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-zoom_in-24px.svg'));

    iconRegistry.addSvgIcon(
      'chevron_down',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-keyboard_arrow_down-24px.svg'));

    iconRegistry.addSvgIcon(
      'chevron_up',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-keyboard_arrow_up-24px.svg'));

    iconRegistry.addSvgIcon(
      'drop_down',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-arrow_drop_down-24px.svg'));

    iconRegistry.addSvgIcon(
      'drop_up',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-arrow_drop_up-24px.svg'));

    iconRegistry.addSvgIcon(
      'done',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-done-24px.svg'));

    iconRegistry.addSvgIcon(
      'link',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-link-24px.svg'));

    iconRegistry.addSvgIcon(
      'get_app',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-get_app-24px.svg'));

    iconRegistry.addSvgIcon(
      'account_circle',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-account_circle-24px.svg'));

    iconRegistry.addSvgIcon(
      'find_replace',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-find_replace-24px.svg'));

    iconRegistry.addSvgIcon(
      'not_interested',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-not_interested-24px.svg'));

    iconRegistry.addSvgIcon(
      'spellcheck',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-spellcheck-24px.svg'));

    iconRegistry.addSvgIcon(
      'view_module',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-view_module-24px.svg'));
    iconRegistry.addSvgIcon(
      'lock_open',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-lock_open-24px.svg'));
    iconRegistry.addSvgIcon(
      'lock',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-lock-24px.svg'));
    iconRegistry.addSvgIcon(
      'open_in_new',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-open_in_new-24px.svg'));
    iconRegistry.addSvgIcon(
      'cancel',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-cancel-24px.svg'));
    iconRegistry.addSvgIcon(
      'add_circle_outline',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-add_circle_outline-24px.svg'));
    iconRegistry.addSvgIcon(
      'arrow_downward',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-arrow_downward-24px.svg'));
    iconRegistry.addSvgIcon(
      'cloud_upload',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-cloud_upload-24px.svg'));
    iconRegistry.addSvgIcon(
      'cloud_download',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-cloud_download-24px.svg'));
    iconRegistry.addSvgIcon(
      'attachment',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-attachment-24px.svg'));
    iconRegistry.addSvgIcon(
      'undo',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-undo-24px.svg'));
    iconRegistry.addSvgIcon(
      'move_to_inbox',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-move_to_inbox-24px.svg'));
    iconRegistry.addSvgIcon(
      'clear',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-clear-24px.svg'));
    iconRegistry.addSvgIcon(
      'settings_applications',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-settings_applications-24px.svg'));
    iconRegistry.addSvgIcon(
      'file_copy',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-file_copy-24px.svg'));
    iconRegistry.addSvgIcon(
      'outline-file_copy',
    sanitizer.bypassSecurityTrustResourceUrl('assets/icons/outline-file_copy-24px.svg')); iconRegistry.addSvgIcon(
      'outline-description',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/outline-description-24px.svg'));
  }

}
