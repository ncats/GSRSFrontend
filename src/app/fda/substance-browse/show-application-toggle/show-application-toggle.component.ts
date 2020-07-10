import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubstanceBrowseHeaderDynamicContent } from '@gsrs-core/substances-browse/substance-browse-header-dynamic-content.component';
import { GeneralService } from '../../service/general.service';
import { ConfigService } from '../../../core/config/config.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-show-application-toggle',
  templateUrl: './show-application-toggle.component.html',
  styleUrls: ['./show-application-toggle.component.scss']
})
export class ShowApplicationToggleComponent implements OnInit, SubstanceBrowseHeaderDynamicContent {
  test: any;
  isAdmin = false;
  displayMatchApplicationConfig = false;
  displayMatchAppCheckBoxValue = false;

  constructor(
    private generalService: GeneralService,
    private configService: ConfigService,
    private authService: AuthService,
    private router: Router,
    public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.isAdmin = this.authService.hasAnyRoles('Admin', 'SuperUpdater');
    this.isAdmin = true;
    if (this.isAdmin === true) {
      this.isDisplayAppToMatchConfig();
    }
  }

  isDisplayAppToMatchConfig(): void {
    if (this.configService.configData && this.configService.configData.displayMatchApplication !== null) {
      this.displayMatchApplicationConfig = JSON.parse(this.configService.configData.displayMatchApplication);

      // If the key 'displayMatchApplication' is set to true in conf.json file,
      // display the checkbox.
      if (this.displayMatchApplicationConfig === true) {
        const data = sessionStorage.getItem('matchAppCheckBoxValueSess');
        if (data === null) {
          sessionStorage.setItem('matchAppCheckBoxValueSess', 'false');
          this.displayMatchAppCheckBoxValue = false;
        } else {
          this.displayMatchAppCheckBoxValue = JSON.parse(data);
        }
      }
    }
  }

  setDisplayAppToMatchSession(checkBoxValue: any): void {
    sessionStorage.setItem('matchAppCheckBoxValueSess', checkBoxValue);

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/browse-substance']);
  }

}
