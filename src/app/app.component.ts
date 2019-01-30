import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
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
  }
}
