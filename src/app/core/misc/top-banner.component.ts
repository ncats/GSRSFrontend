import { Component, inject, OnInit, signal } from "@angular/core";
import { ConfigService } from "../config/config.service";

@Component({
  selector: "app-top-banner",
  templateUrl: "./top-banner.component.html",
  styleUrls: ["./top-banner.component.scss"],
  standalone: false,
})
export class TopBannerComponent implements OnInit {
  public configService = inject(ConfigService);
  bannerText = signal(
    "This repository is under review for potential modification in compliance with Administration directives.",
  );

  ngOnInit() {
    if (this.configService.configData.bannerText) {
      this.bannerText.set(this.configService.configData.bannerText);
    }
  }
}
