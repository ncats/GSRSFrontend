import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config/config.service';


@Component({
  selector: 'app-top-banner',
  templateUrl: './top-banner.component.html',
  styleUrls: ['./top-banner.component.scss'],
  standalone: false
})
export class TopBannerComponent implements OnInit {
  bannerText: string = "This repository is under review for potential modification in compliance with Administration directives.";

  constructor(    
    public configService: ConfigService
  )
  { }
  ngOnInit(){
    if(this.configService.configData.bannerText) {
      this.bannerText = this.configService.configData.bannerText;
    }
  }
}