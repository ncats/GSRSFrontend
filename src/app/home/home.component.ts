import { Component, OnInit } from '@angular/core';
import { environment} from '../../environments/environment';
import { ConfigService } from '../config/config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private configService: ConfigService
  ) { }

  ngOnInit() {
    if (environment.version === 'gsrs') {
      console.log(environment);
    }

    console.log(this.configService.configData);
  }
}
