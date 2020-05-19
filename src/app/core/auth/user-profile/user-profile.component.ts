import { Component, OnInit } from '@angular/core';
import { Auth } from '@gsrs-core/auth/auth.model';
import { AuthService } from '@gsrs-core/auth/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: Auth;
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.getAuth().subscribe( response => {
      this.user = response;
      console.log(response);
    })
  }

}
