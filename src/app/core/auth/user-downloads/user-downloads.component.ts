import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { UserDownload } from '@gsrs-core/auth/user-downloads/download.model';

@Component({
  selector: 'app-user-downloads',
  templateUrl: './user-downloads.component.html',
  styleUrls: ['./user-downloads.component.scss']
})
export class UserDownloadsComponent implements OnInit {
  id?: string;
  downloads?: Array< UserDownload >;
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  )
    {}

  // use aspirin for initial development a05ec20c-8fe2-4e02-ba7f-df69e5e30248
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'] || null;
    if (!this.id) {
      this.authService.getAllDownloads().subscribe(response => {
        this.downloads = response.downloads;
      })
    }
  }

}
