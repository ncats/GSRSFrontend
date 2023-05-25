import { Component, Input, OnDestroy,  OnInit, Output } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { of, Subscription, timer } from "rxjs";
import { catchError, filter, switchMap } from "rxjs/operators";
import { ConfigService } from '../config/config.service';
import { Router, ActivatedRoute, UrlSegment, NavigationEnd } from '@angular/router';
import {Location} from '@angular/common';

/*
  Example configuration:
  "sessionChecker": { 
    "check": false,            # does nothing if false
    "redirectUrl": "",         # first priority handler action taken if not blank or undefined
    "redirectToLogin": false,  # 2nd priority handler, action take if true
    "alertMessage": ""         # 3rd priority handler, action taken if not blank or undefined
  },
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
      const redirectToLogin = this.configService.configData?.sessionChecker?.redirectToLogin||'';
      if (redirectToLogin) {
        actionTaken = true;
        this.router.navigate(['/login']);
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