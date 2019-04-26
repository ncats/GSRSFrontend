import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';

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
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.router.navigate(['/browse-substance']);
      } else {
        this.isLoaded = true;
        this.isLoading = false;
      }
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const username = this.loginForm.controls.username.value;
      const password = this.loginForm.controls.password.value;
      this.authService.login(username, password).subscribe(auth => {
        if (auth) {
          this.router.navigate(['/browse-substance']);
        } else {
          this.isLoading = false;
        }
      });
    }
  }

}
