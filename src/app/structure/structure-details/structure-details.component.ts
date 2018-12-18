import { Component, OnInit } from '@angular/core';
import { SubstanceStructure } from '../../substance/substance.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConfigService } from '../../config/config.service';

@Component({
  selector: 'app-structure-details',
  templateUrl: './structure-details.component.html',
  styleUrls: ['./structure-details.component.scss']
})
export class StructureDetailsComponent implements OnInit {
  data: SubstanceStructure;

  constructor(
    private sanitizer: DomSanitizer,
    public configService: ConfigService
  ) { }

  ngOnInit() {
    console.log(this.data);
  }

  getSafeStructureImgUrl(structureId: string): SafeUrl {

    const imgUrl = `${this.configService.configData.apiBaseUrl}img/${structureId}.svg?size=150`;

    return this.sanitizer.bypassSecurityTrustUrl(imgUrl);
  }

}
