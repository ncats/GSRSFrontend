import { Component, OnInit } from '@angular/core';
import { ConfigService } from '@gsrs-core/config';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent implements OnInit {
  email?: string;
  constructor(
    private configService: ConfigService
  ) { }

  ngOnInit() {
    if (this.configService.configData && this.configService.configData.contactEmail) {
      this.email = this.configService.configData.contactEmail;
    }
  }

}
