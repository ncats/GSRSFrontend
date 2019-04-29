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
      'account_circle',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-account_circle-24px.svg'));
  }

}
