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
  email?: string;
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.configService.configData && this.configService.configData.contactEmail) {
      this.email = this.configService.configData.contactEmail;
    }

    this.authService.getAuth().pipe(take(1)).subscribe(response => {
      if (response && response.active) {
        this.router.navigate(['/home']);
      }
    });
  }

}
