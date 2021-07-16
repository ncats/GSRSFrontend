import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../../config/config.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AuthService } from '../../auth/auth.service';
import { Auth } from '../../auth/auth.model';
import { Subscription } from 'rxjs';

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
  private overlayContainer: HTMLElement;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private router: Router,
    private configService: ConfigService,
    private overlayContainerService: OverlayContainer,
    public authService: AuthService,
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
  }

  increaseMenuZindex(): void {
    this.overlayContainer.style.zIndex = '1001';
  }

  removeZindex(): void {
    this.overlayContainer.style.zIndex = null;
  }
}
