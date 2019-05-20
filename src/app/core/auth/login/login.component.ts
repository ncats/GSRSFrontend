import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingService } from '../../loading/loading.service';
import { MainNotificationService } from '../../main-notification/main-notification.service';
import { AppNotification, NotificationType } from '../../main-notification/notification.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoaded = false;
  isLoading = true;
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService
  ) { }

  ngOnInit() {
    this.loadingService.setLoading(true);
    this.authService.getAuth().subscribe(auth => {
      this.loadingService.setLoading(false);
      if (auth) {
        this.router.navigate(['/browse-substance']);
      } else {
        this.isLoaded = true;
        this.isLoading = false;
      }
    }, error => {
      this.loadingService.setLoading(false);
      this.isLoaded = true;
      this.isLoading = false;
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.loadingService.setLoading(true);
      this.isLoading = true;
      const username = this.loginForm.controls.username.value;
      const password = this.loginForm.controls.password.value;
      this.authService.login(username, password).subscribe(auth => {
        this.loadingService.setLoading(false);
        if (auth) {
          this.router.navigate(['/browse-substance']);
        } else {
          this.isLoading = false;
        }
      }, error => {
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
