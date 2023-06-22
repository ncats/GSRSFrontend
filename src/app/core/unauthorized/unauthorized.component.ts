import { Component, OnInit } from '@angular/core';
import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent implements OnInit {
  /*
  if you want the default behavor, exclude "unauthorized" from the configuration.

  if you are using session-checker.component.ts, and redirecting to an external link when the session expires
  you will probably want to configure something like this. 

  "unauthorized": {
    "link": "https://external.link.com",  
    "message": "You are not authorized to access this resource.<br>Check this link. Login, or use the contact email to request access.",
    "redirectToHome": true,
    "redirectUrl": "https://external.link.com"
  },

  * link -- is displayed on the unauthorized page
  * redirectUrl -- redirect to this url if the user is not defined.
  */
 

  email?: string;
  message?: string;
  link?: string;
  redirectToHome?: boolean;
  redirectUrl?: string;
  useConfiguredMessage?: boolean;


  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.configService.configData && this.configService.configData.contactEmail) {
      this.email = this.configService.configData.contactEmail;
    }
    this.useConfiguredMessage = ("unauthorized" in this.configService.configData);
    this.message = this.configService.configData?.unauthorized?.message||'';
    this.link = this.configService.configData?.unauthorized?.link||'';
    this.redirectUrl = this.configService.configData?.unauthorized?.redirectUrl||'';
    this.redirectToHome = this.configService.configData?.unauthorized?.redirectToHome||true;

    this.authService.getAuth().pipe(take(1)).subscribe(response => {
      if (response && response.active) {
        if (this.redirectToHome) {
          this.router.navigate(['/home']);
        }
      } else {
        if (this.redirectUrl) {
          window.location.href = this.redirectUrl;    
        }
      }
    });
  }

}
