import { Component, Input, OnDestroy,  OnInit, Output } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { of, Subscription, timer } from "rxjs";
import { catchError, filter, switchMap } from "rxjs/operators";
import { ConfigService } from '../config/config.service';
import { Router, ActivatedRoute, UrlSegment, NavigationEnd } from '@angular/router';
import {Location} from '@angular/common';

/*

  # A) To use this you will probably want these setting in the substances service application.conf or whatever service handles authentication

  ix.authentication.trustheader=false
  ix.authentication.allownonauthenticated=false

  # B) You will probably want this item in config.json; See the logout method in the base.component.ts file. 

  "logoutRedirectUrl": "https://external.link.com".   

  # C) You should also configure "unauthorized" in the frontend.  See the unauthorized-component.ts file. 

  # D) For this coponenent itself, consider this example frontend configuration in the config.json file.

  "sessionChecker": { 
    "check": false,            # does nothing if false
    "interval": "30",          # in minutes; default is 30
    "redirectUrl": "",         # first priority handler action taken if not blank or undefined
    "redirectToLogin": false,  # 2nd priority handler, action take if true
    "alertMessage": ""         # 3rd priority handler, action taken if not blank or undefined
  },

  redirectToLogin -- disabled for now.

*/

@Component({
  selector: "app-session-checker",
  templateUrl: "./session-checker.component.html",
  styleUrls: ["./session-checker.component.scss"]
})
export class SessionCheckerComponent implements OnInit, OnDestroy {
  @Output() data: any;
  apiUrl: string;
  subscription: Subscription;

  constructor(
    private http: HttpClient,
    public configService: ConfigService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location    
  ) {}

  ngOnInit() {
    const config = this.configService?.configData;
    const check = config?.sessionChecker?.check;
    const interval: number = config?.sessionChecker?.interval||30;
    const milliseconds: number= interval * 60 * 1000;
    this.apiUrl =`${(config?.apiBaseUrl) || '/'}api/v1/whoami`;

    if (config!==undefined && check && check===true) { 
      const path = this.location?.path();
      console.log("here path "+ path);
      if (path!==undefined && !(path=='/login' || path.match('^\/login\?')))  {

          this.subscription = timer(0, milliseconds)
            .pipe(
              switchMap(() => {      
                return this.getData()
                  .pipe(catchError(err => {
                    this.handler();  
                    console.error(err);
                    return of(undefined);
                  }));
              }),
              filter(data => data !== undefined)
            )
            .subscribe(data => {
              this.data = data;
            }); 
      } // login path
    } // config && check 
  }

  ngOnDestroy() {
    if(this.subscription!==undefined) { 
    this.subscription.unsubscribe();
    }
  }

  handler() { 
    let actionTaken = false;
    const redirectUrl = this.configService.configData?.sessionChecker?.redirectUrl||'';

    if(redirectUrl) {   
      actionTaken = true;
      window.location.href = this.configService.configData.sessionChecker.redirectUrl; 
    } 
    if (!actionTaken) { 
      // tried to make this more general but got infinite loops in some cases.
      // disabling for now, to prevent loops.
      const redirectToLogin = this.configService.configData?.sessionChecker?.redirectToLogin||'';
      if (redirectToLogin) {
        actionTaken = true;
        console.log("redirectToLogin effectively disabled in code for now."); 
        // this.router.navigate(['/login']);
      }
    }  

    if(!actionTaken) {
      const alertMessage = this.configService.configData?.sessionChecker?.alertMessage||'';
      if (alertMessage) {
        actionTaken = true; 
        alert(alertMessage)
      }
    } 
    if (!actionTaken) { 
          console.log("Session expired but session checker handler took no action. Check configration options."); 
    }
    
  }

  getData() {
    return this.http.get(this.apiUrl);
  }
}