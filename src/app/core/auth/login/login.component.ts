import { Component, OnInit, OnDestroy, HostListener, Inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { ConfigService } from '@gsrs-core/config/config.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../loading/loading.service';
import { MainNotificationService } from '../../main-notification/main-notification.service';
import { AppNotification, NotificationType } from '../../main-notification/notification.model';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { Subscription } from 'rxjs';
import { RegisterComponent } from '../../register/register.component';
import { DOCUMENT } from '@angular/common';
import { PwdRecoveryComponent } from '@gsrs-core/pwd-recovery/pwd-recovery.component';
import * as _ from 'lodash';
import { UserRegistrationConfigurations } from '@gsrs-core/config';
import {sprintf} from "sprintf-js";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoaded = false;
  isLoading = true;
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  private subscriptions: Array<Subscription> = [];
  private newuserinfo = {};
  private emailFormUserRegConf: UserRegistrationConfigurations = undefined;
  public emailFormUserRegActive: boolean = false;

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private router: Router,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document 
  ) { }

  @HostListener('keyup', ['$event'])
  onKeyup(event: KeyboardEvent) {
    if (event.code && event.code.toLowerCase() === 'enter') {
      this.login();
    }
  }

  ngOnInit() {
    this.loadingService.setLoading(true);

    // As we develop more types of userRegistration, make a utility service to provide configuration information.  

    if(typeof this.configService.configData.userRegistrationConfigurations !== "undefined" ) {
      this.emailFormUserRegConf = this.configService.configData.userRegistrationConfigurations.find(c=>c.active === true && c.name === 'emailForm'); 
      if(typeof this.emailFormUserRegConf !== "undefined" ) {
        this.emailFormUserRegActive = this.emailFormUserRegConf.active; 
      }
    }
    const subscription = this.authService.getAuth().subscribe(auth => {
      this.loadingService.setLoading(false);
      if (auth) {
        const route = this.activatedRoute.snapshot.queryParamMap.get('path') || '/browse-substance';
        this.router.navigate([route]);
      } else {
        this.isLoaded = true;
        this.isLoading = false;
      }
    }, error => {
      this.loadingService.setLoading(false);
      this.isLoaded = true;
      this.isLoading = false;
    });
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.loadingService.setLoading(true);
      this.isLoading = true;
      const username = this.loginForm.controls.username.value;
      const password = this.loginForm.controls.password.value;
      const subscription = this.authService.login(username, password).subscribe(auth => {
        subscription.unsubscribe();
        this.loadingService.setLoading(false);
        if (auth) {
          const route = this.activatedRoute.snapshot.queryParamMap.get('path') || '/browse-substance';
          this.router.navigate([route]);
        } else {
          this.isLoading = false;
        }
      }, error => {
        subscription.unsubscribe();
        const notification: AppNotification = {
          message: 'There was an error logging you in. Please check your credentials and try again.',
          type: NotificationType.error
        };
        this.mainNotificationService.setNotification(notification);
        this.loadingService.setLoading(false);
        this.isLoaded = true;
        this.isLoading = false;
      });
    }
  }

  register() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(RegisterComponent, dialogConfig);
    const c = this.emailFormUserRegConf;
    dialogRef.afterClosed().subscribe(
      data => {
        this.newuserinfo = data;
        const recipients = c.adminRecipientEmails.join(",");
        let text = sprintf(c.emailBodyTemplate, c.instanceApplicationName, data.username, data.email); 
        const linefeed = "%0D%0A";
        text = text.replace(/\n/g, linefeed);
        const subject = sprintf(c.emailSubjectTemplate, c.instanceApplicationSubjectTag);  
        this.document.location = "mailto:"+recipients +"?subject=" + (subject) + "&body=" + (text);
        console.log('email sending...');
      }
    );
  }

  callPwdPage(type: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = type;
    const dialogRef = this.dialog.open(PwdRecoveryComponent, dialogConfig);
    dialogRef.afterClosed().subscribe();
  }
}
