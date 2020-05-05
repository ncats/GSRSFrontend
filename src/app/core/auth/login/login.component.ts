import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../loading/loading.service';
import { MainNotificationService } from '../../main-notification/main-notification.service';
import { AppNotification, NotificationType } from '../../main-notification/notification.model';
import { Subscription } from 'rxjs';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadingService.setLoading(true);
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

  @HostListener('keyup', ['$event'])
  onKeyup(event: KeyboardEvent) {
    console.log(event);
    if (event.code && event.code.toLowerCase() === 'enter') {
      this.login();
    }
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

}
